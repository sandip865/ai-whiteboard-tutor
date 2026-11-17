'use client';

import React from 'react';
import { LessonPlan } from '@/types/tutor';
import { PlayCircle, CheckCircle2, Clock } from 'lucide-react';

interface ChapterBeatsNavigatorProps {
  lesson: LessonPlan | null;
  currentGlobalTime: number;
  onSelectBeat: (beatIndex: number) => void;
}

export const ChapterBeatsNavigator: React.FC<ChapterBeatsNavigatorProps> = ({
  lesson,
  currentGlobalTime,
  onSelectBeat,
}) => {
  if (!lesson || !lesson.beats || lesson.beats.length === 0) return null;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          2-Minute Lesson Roadmap (5 Interactive Beats)
        </span>
        <span className="text-[11px] text-slate-500 font-mono">
          Total Duration: ~{Math.round(lesson.totalDuration)}s
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {lesson.beats.map((beat, idx) => {
          const isCurrent =
            currentGlobalTime >= beat.startTime &&
            currentGlobalTime < beat.startTime + beat.duration;
          const isCompleted = currentGlobalTime >= beat.startTime + beat.duration;

          return (
            <button
              key={beat.id}
              type="button"
              onClick={() => onSelectBeat(idx)}
              className={`text-left p-2.5 rounded-xl border transition flex flex-col justify-between gap-1.5 relative overflow-hidden ${
                isCurrent
                  ? 'bg-cyan-950/60 border-cyan-500/80 shadow-md shadow-cyan-500/10'
                  : isCompleted
                  ? 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  : 'bg-slate-900/50 border-slate-800/50 text-slate-500 hover:border-slate-700'
              }`}
            >
              {/* Active top highlight line */}
              {isCurrent && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
              )}

              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isCurrent ? 'text-cyan-400' : isCompleted ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Beat {idx + 1}
                </span>

                <span className="text-[10px] font-mono text-slate-500">
                  {formatSeconds(beat.startTime)}
                </span>
              </div>

              <h4
                className={`text-xs font-bold line-clamp-1 ${
                  isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-400'
                }`}
              >
                {beat.title}
              </h4>

              <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                {beat.summary}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 w-full text-[10px]">
                <span className="text-slate-500 font-mono">{beat.duration}s</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : isCurrent ? (
                  <PlayCircle className="w-3 h-3 text-cyan-400 animate-pulse" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
