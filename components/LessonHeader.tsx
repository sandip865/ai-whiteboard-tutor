'use client';

import React from 'react';
import { LessonPlan } from '@/types/tutor';
import { Sparkles, BookOpen, GraduationCap, Github } from 'lucide-react';

interface LessonHeaderProps {
  lesson: LessonPlan | null;
  onSelectFeatured: (topicKey: string) => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  lesson,
  onSelectFeatured,
}) => {
  return (
    <header className="w-full bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">Braynix Tutor</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-[10px] tracking-wide uppercase">
                AI Whiteboard
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Synchronized Voice Narration & Interactive Visual Demonstrations
            </p>
          </div>
        </div>

        {/* Featured Quick Switch */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden lg:inline font-medium">Flagship Lessons:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSelectFeatured('transformers-attention')}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition ${lesson?.id === 'transformers-attention' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              ⚡ Transformers
            </button>
            <button
              type="button"
              onClick={() => onSelectFeatured('binary-search-trees')}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition ${lesson?.id === 'binary-search-trees' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              🌳 Binary Search Trees
            </button>
            <button
              type="button"
              onClick={() => onSelectFeatured('quantum-superposition')}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition ${lesson?.id === 'quantum-superposition' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              ⚛️ Quantum Physics
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
