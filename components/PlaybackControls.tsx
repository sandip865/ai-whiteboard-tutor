'use client';

import React, { useState, useEffect } from 'react';
import { LessonPlan, WhiteboardTheme } from '@/types/tutor';
import { speechService } from '@/lib/speechService';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Gauge,
  Palette,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PlaybackControlsProps {
  lesson: LessonPlan | null;
  currentGlobalTime: number; // in seconds (0 to 120)
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (targetSeconds: number) => void;
  onRestart: () => void;
  onNextBeat: () => void;
  onPrevBeat: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  theme: WhiteboardTheme;
  onThemeChange: (theme: WhiteboardTheme) => void;
  interactiveMode: boolean;
  onToggleInteractiveMode: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  lesson,
  currentGlobalTime,
  isPlaying,
  onPlay,
  onPause,
  onSeek,
  onRestart,
  onNextBeat,
  onPrevBeat,
  playbackSpeed,
  onSpeedChange,
  theme,
  onThemeChange,
  interactiveMode,
  onToggleInteractiveMode,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoiceName, setCurrentVoiceName] = useState<string>('');
  const [showVoiceSelect, setShowVoiceSelect] = useState(false);

  const totalDuration = lesson?.totalDuration || 120;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const v = speechService.getVoices();
      setVoices(v);
      setCurrentVoiceName(speechService.getSelectedVoiceName());
    }
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    speechService.isMuted = nextMuted;
    if (nextMuted) {
      speechService.stop();
    }
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    speechService.setVoice(name);
    setCurrentVoiceName(name);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col gap-3">
      {/* 1. Scrubber & Timeline Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-sm">{formatTime(currentGlobalTime)}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-500 font-mono text-xs">{formatTime(totalDuration)}</span>
          </div>

          <div className="flex items-center gap-2">
            {lesson?.beats && (
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                Chapter: {lesson.beats.find(b => currentGlobalTime >= b.startTime && currentGlobalTime < b.startTime + b.duration)?.title || 'Lesson Overview'}
              </span>
            )}
          </div>
        </div>

        {/* Timeline Slider with Chapter Markers */}
        <div className="relative w-full flex items-center group py-1">
          <input
            type="range"
            min={0}
            max={totalDuration}
            step={0.5}
            value={currentGlobalTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />

          {/* Chapter Beat Notch Markers */}
          {lesson?.beats?.map((beat, idx) => {
            const leftPct = (beat.startTime / totalDuration) * 100;
            return (
              <div
                key={beat.id}
                style={{ left: `${leftPct}%` }}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-700 border border-slate-900 pointer-events-none group-hover:bg-cyan-600 transition"
                title={`${idx + 1}. ${beat.title}`}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
        {/* Left: Main Transport Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Previous Beat */}
          <button
            type="button"
            onClick={onPrevBeat}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            title="Previous Chapter"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            type="button"
            onClick={isPlaying ? onPause : onPlay}
            className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition transform active:scale-95"
            title={isPlaying ? 'Pause Lesson' : 'Play Lesson'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
          </button>

          {/* Next Beat */}
          <button
            type="button"
            onClick={onNextBeat}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            title="Next Chapter"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={onRestart}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            title="Restart from Beginning (00:00)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mute / Unmute */}
          <button
            type="button"
            onClick={handleMuteToggle}
            className={`p-2 rounded-xl transition ${isMuted ? 'text-rose-400 bg-rose-950/40 border border-rose-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Center: Mode Switch (Tutor Presentation vs Learner Drawing) */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => {
              if (interactiveMode) onToggleInteractiveMode();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${!interactiveMode ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tutor Presentation</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!interactiveMode) onToggleInteractiveMode();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${interactiveMode ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Learner Canvas</span>
          </button>
        </div>

        {/* Right: Speed, Theme, and Voice Options */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700/60 text-xs">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            {[0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => onSpeedChange(speed)}
                className={`px-1.5 py-0.5 rounded font-mono text-[11px] transition ${playbackSpeed === speed ? 'bg-cyan-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Theme Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition flex items-center gap-1"
              title="Change Whiteboard Theme"
            >
              <Palette className="w-4 h-4" />
            </button>
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-900 border border-slate-800 p-1.5 rounded-xl shadow-2xl z-50 min-w-[130px]">
              {(['blueprint', 'dark', 'chalkboard', 'clean'] as WhiteboardTheme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onThemeChange(t)}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs capitalize transition ${theme === t ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Selector button / modal toggle */}
          {voices.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowVoiceSelect(!showVoiceSelect)}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white text-xs truncate max-w-[140px]"
                title="Select Narration Voice"
              >
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{currentVoiceName.split(' ')[0] || 'Voice'}</span>
              </button>

              {showVoiceSelect && (
                <div className="absolute right-0 bottom-full mb-2 bg-slate-900 border border-slate-800 p-2 rounded-xl shadow-2xl z-50 w-64 max-h-60 overflow-y-auto">
                  <span className="text-[11px] font-semibold text-slate-400 px-2 py-1 block">Choose Voice:</span>
                  <select
                    value={currentVoiceName}
                    onChange={handleVoiceChange}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2 rounded-lg outline-none"
                  >
                    {voices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
