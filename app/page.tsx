'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LessonPlan,
  LessonBeat,
  WhiteboardTheme,
  ChatMessage,
  Point,
  WhiteboardAction,
} from '@/types/tutor';
import { CURATED_LESSONS } from '@/data/curatedLessons';
import { generateLessonPlan, answerFollowUpQuestion } from '@/lib/aiLessonGenerator';
import { speechService } from '@/lib/speechService';
import { LessonHeader } from '@/components/LessonHeader';
import { WhiteboardCanvas } from '@/components/WhiteboardCanvas';
import { PlaybackControls } from '@/components/PlaybackControls';
import { ChapterBeatsNavigator } from '@/components/ChapterBeatsNavigator';
import { ChatTutorPanel } from '@/components/ChatTutorPanel';
import confetti from 'canvas-confetti';

export default function WhiteboardTutorPage() {
  // Current active lesson
  const [lesson, setLesson] = useState<LessonPlan | null>(
    CURATED_LESSONS['transformers-attention']
  );

  // Global playback state (0 to 120 seconds)
  const [currentGlobalTime, setCurrentGlobalTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [theme, setTheme] = useState<WhiteboardTheme>('blueprint');
  const [interactiveMode, setInteractiveMode] = useState<boolean>(false);

  // Extra annotations added via interactive follow-ups
  const [extraAnnotations, setExtraAnnotations] = useState<WhiteboardAction[]>([]);

  // Tutor laser pointer position
  const [laserPointerPos, setLaserPointerPos] = useState<Point | null>(null);

  // Chat conversation
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);
  const [userApiKey, setUserApiKey] = useState<string>('');

  // Refs for animation loop
  const lastTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const currentBeatIndexRef = useRef<number>(0);

  // Load API key from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('braynix_tutor_api_key') || '';
      if (savedKey) setUserApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setUserApiKey(key);
    if (typeof window !== 'undefined') {
      if (key) localStorage.setItem('braynix_tutor_api_key', key);
      else localStorage.removeItem('braynix_tutor_api_key');
    }
  };

  // Determine current active beat from global time
  const currentBeat = React.useMemo(() => {
    if (!lesson || !lesson.beats || lesson.beats.length === 0) return null;
    const found = lesson.beats.find(
      (b) => currentGlobalTime >= b.startTime && currentGlobalTime < b.startTime + b.duration
    );
    return found || lesson.beats[lesson.beats.length - 1];
  }, [lesson, currentGlobalTime]);

  const currentBeatTime = currentBeat ? Math.max(0, currentGlobalTime - currentBeat.startTime) : 0;

  // Speak current beat narration
  const speakCurrentBeatNarration = useCallback(
    (beat: LessonBeat) => {
      if (!beat) return;
      speechService.playbackRate = playbackSpeed;
      speechService.speak(beat.narration, undefined, () => {
        // Narration for beat finished naturally
      });
    },
    [playbackSpeed]
  );

  // Timeline tick handler
  const tick = useCallback(
    (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setCurrentGlobalTime((prevTime) => {
        if (!lesson) return 0;
        const totalDuration = lesson.totalDuration || 120;
        const nextTime = prevTime + dt * playbackSpeed;

        if (nextTime >= totalDuration) {
          // Lesson completed!
          setIsPlaying(false);
          speechService.stop();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          return totalDuration;
        }

        // Check if beat index changed
        if (lesson.beats) {
          const newBeatIndex = lesson.beats.findIndex(
            (b) => nextTime >= b.startTime && nextTime < b.startTime + b.duration
          );
          if (newBeatIndex !== -1 && newBeatIndex !== currentBeatIndexRef.current) {
            currentBeatIndexRef.current = newBeatIndex;
            speakCurrentBeatNarration(lesson.beats[newBeatIndex]);
          }
        }

        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    },
    [lesson, playbackSpeed, speakCurrentBeatNarration]
  );

  // Start / Stop animation frame loop on isPlaying change
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, tick]);

  // Update laser pointer position based on current beat actions
  useEffect(() => {
    if (!currentBeat) {
      setLaserPointerPos(null);
      return;
    }

    const latestLaserAction = [...currentBeat.actions]
      .filter((a) => a.type === 'laser_pointer' && a.timeOffset <= currentBeatTime)
      .pop();

    if (latestLaserAction) {
      setLaserPointerPos({ x: latestLaserAction.x, y: latestLaserAction.y });
    } else {
      setLaserPointerPos(null);
    }
  }, [currentBeat, currentBeatTime]);

  // Transport handlers
  const handlePlay = () => {
    if (!lesson) return;
    setIsPlaying(true);
    if (currentBeat) {
      speakCurrentBeatNarration(currentBeat);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    speechService.pause();
  };

  const handleSeek = (targetSeconds: number) => {
    if (!lesson) return;
    const clamped = Math.max(0, Math.min(targetSeconds, lesson.totalDuration));
    speechService.stop();
    setCurrentGlobalTime(clamped);

    if (lesson.beats) {
      const newBeatIndex = lesson.beats.findIndex(
        (b) => clamped >= b.startTime && clamped < b.startTime + b.duration
      );
      if (newBeatIndex !== -1) {
        currentBeatIndexRef.current = newBeatIndex;
        if (isPlaying) {
          speakCurrentBeatNarration(lesson.beats[newBeatIndex]);
        }
      }
    }
  };

  const handleRestart = () => {
    speechService.stop();
    setCurrentGlobalTime(0);
    setExtraAnnotations([]);
    currentBeatIndexRef.current = 0;
    if (lesson && lesson.beats && lesson.beats.length > 0) {
      if (isPlaying) {
        speakCurrentBeatNarration(lesson.beats[0]);
      }
    }
  };

  const handleNextBeat = () => {
    if (!lesson || !currentBeat) return;
    const nextIdx = currentBeat.beatIndex; // 1-indexed to 0-indexed next
    if (nextIdx < lesson.beats.length) {
      handleSeek(lesson.beats[nextIdx].startTime);
    }
  };

  const handlePrevBeat = () => {
    if (!lesson || !currentBeat) return;
    const prevIdx = currentBeat.beatIndex - 2;
    if (prevIdx >= 0) {
      handleSeek(lesson.beats[prevIdx].startTime);
    } else {
      handleSeek(0);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    speechService.playbackRate = newSpeed;
  };

  // Flagship lesson switch
  const handleSelectFeatured = (topicKey: string) => {
    const featured = CURATED_LESSONS[topicKey];
    if (featured) {
      speechService.stop();
      setIsPlaying(false);
      setLesson(featured);
      setCurrentGlobalTime(0);
      setExtraAnnotations([]);
      currentBeatIndexRef.current = 0;
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'tutor',
          text: `Now teaching: **${featured.topic}** (${featured.difficulty} Level).\n\n${featured.overview}\n\nPress **Play** or choose a chapter beat below to begin!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  // Dynamic AI lesson generation
  const handleGenerateTopic = async (
    topicName: string,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  ) => {
    if (!topicName.trim()) {
      setLesson(null);
      return;
    }

    speechService.stop();
    setIsPlaying(false);
    setIsGenerating(true);

    try {
      const { lesson: newLesson, isLiveAi } = await generateLessonPlan(
        topicName,
        userApiKey,
        'auto',
        difficulty
      );

      setLesson(newLesson);
      setCurrentGlobalTime(0);
      setExtraAnnotations([]);
      currentBeatIndexRef.current = 0;

      const modelBadge = isLiveAi ? '⚡ Live AI Model' : '🧠 Intelligent Curriculum Synthesizer';
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-user-${Date.now()}`,
          sender: 'user',
          text: `Please teach me: "${topicName}" (${difficulty} level)`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          id: `msg-tutor-${Date.now() + 1}`,
          sender: 'tutor',
          text: `🎉 **New 2-Minute Lesson Generated** [${modelBadge}]\n\n**Topic:** ${newLesson.topic}\n**Difficulty:** ${newLesson.difficulty}\n\n${newLesson.overview}\n\nI have prepared 5 synchronized whiteboard chapters with dynamic illustrations. Press **Play** or scrub the timeline above!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e) {
      console.error('Error generating lesson:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Follow-up Q&A
  const handleAskQuestion = async (question: string) => {
    if (!lesson) return;
    setIsAnswering(true);

    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-user-${Date.now()}`,
        sender: 'user',
        text: question,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    try {
      const res = await answerFollowUpQuestion(
        question,
        lesson,
        chatMessages.map((m) => ({ sender: m.sender, text: m.text })),
        userApiKey
      );

      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-tutor-${Date.now()}`,
          sender: 'tutor',
          text: res.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          whiteboardAnnotation: res.whiteboardAnnotation,
        },
      ]);

      if (res.whiteboardAnnotation) {
        setExtraAnnotations((prev) => [...prev, ...res.whiteboardAnnotation!]);
      }

      // Voice the tutor's response
      speechService.speak(res.spokenText);
    } catch (e) {
      console.error('Error answering question:', e);
    } finally {
      setIsAnswering(false);
    }
  };

  // Element clicked on whiteboard: ask tutor about it!
  const handleElementClick = (elementText: string) => {
    handleAskQuestion(`Tell me more about "${elementText}" and why it is critical.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Top Navigation */}
      <LessonHeader lesson={lesson} onSelectFeatured={handleSelectFeatured} />

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col lg:flex-row gap-5">
        {/* Left Column: Whiteboard Canvas, Playback Controls & Chapter Roadmap (~65% width) */}
        <section className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Whiteboard Canvas */}
          <WhiteboardCanvas
            currentBeat={currentBeat}
            currentTimeInBeat={currentBeatTime}
            theme={theme}
            interactiveMode={interactiveMode}
            onElementClick={handleElementClick}
            laserPointerPos={laserPointerPos}
            extraAnnotations={extraAnnotations}
          />

          {/* Playback Controls (Play, Pause, Seek, Restart, Speed, Theme, Voices) */}
          <PlaybackControls
            lesson={lesson}
            currentGlobalTime={currentGlobalTime}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={handleSeek}
            onRestart={handleRestart}
            onNextBeat={handleNextBeat}
            onPrevBeat={handlePrevBeat}
            playbackSpeed={playbackSpeed}
            onSpeedChange={handleSpeedChange}
            theme={theme}
            onThemeChange={setTheme}
            interactiveMode={interactiveMode}
            onToggleInteractiveMode={() => setInteractiveMode(!interactiveMode)}
          />

          {/* Chapter Roadmap (5 Beats with Direct Chapter Jump) */}
          <ChapterBeatsNavigator
            lesson={lesson}
            currentGlobalTime={currentGlobalTime}
            onSelectBeat={(idx) => {
              if (lesson && lesson.beats && lesson.beats[idx]) {
                handleSeek(lesson.beats[idx].startTime);
              }
            }}
          />
        </section>

        {/* Right Column: Chat-First Tutor Panel with Live Karaoke Subtitles (~35% width) */}
        <aside className="w-full lg:w-[420px] flex flex-col h-[650px] lg:h-auto shrink-0">
          <ChatTutorPanel
            lesson={lesson}
            currentBeat={currentBeat}
            isPlaying={isPlaying}
            onGenerateTopic={handleGenerateTopic}
            onAskQuestion={handleAskQuestion}
            chatMessages={chatMessages}
            isGenerating={isGenerating}
            isAnswering={isAnswering}
            userApiKey={userApiKey}
            onSaveApiKey={handleSaveApiKey}
          />
        </aside>
      </main>
    </div>
  );
}
