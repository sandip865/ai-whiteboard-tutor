'use client';

/**
 * Speech Service:
 * Wraps browser Web Speech API for voice narration with natural voice selection,
 * pitch, rate controls, and bulletproof cancellation/resumption.
 */
class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  public isMuted: boolean = false;
  public playbackRate: number = 1.0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    // Prioritize natural English voices
    const preferred = this.voices.find(
      (v) =>
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Jenny') ||
          v.name.includes('Guy') ||
          v.name.includes('Daniel')) &&
        v.lang.startsWith('en')
    );
    this.selectedVoice = preferred || this.voices.find((v) => v.lang.startsWith('en')) || this.voices[0] || null;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    if (this.voices.length === 0) {
      this.voices = this.synth.getVoices();
    }
    return this.voices.filter((v) => v.lang.startsWith('en'));
  }

  public setVoice(voiceName: string) {
    const v = this.voices.find((item) => item.name === voiceName);
    if (v) this.selectedVoice = v;
  }

  public getSelectedVoiceName(): string {
    return this.selectedVoice?.name || 'Default System Voice';
  }

  public speak(
    text: string,
    onBoundary?: (charIndex: number) => void,
    onEnd?: () => void
  ) {
    if (!this.synth || this.isMuted) {
      if (onEnd) {
        // If muted or unsupported, simulate end after estimated reading time
        const words = text.split(/\s+/).length;
        const ms = (words / (140 * this.playbackRate)) * 60 * 1000;
        setTimeout(onEnd, ms);
      }
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = this.playbackRate;
    utterance.pitch = 1.0;

    if (onBoundary) {
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          onBoundary(event.charIndex);
        }
      };
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance error:', e);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }
}

export const speechService = typeof window !== 'undefined' ? new SpeechService() : ({} as SpeechService);
