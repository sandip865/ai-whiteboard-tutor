'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LessonPlan, LessonBeat, ChatMessage } from '@/types/tutor';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  HelpCircle,
  Key,
  Flame,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { speechService } from '@/lib/speechService';

interface ChatTutorPanelProps {
  lesson: LessonPlan | null;
  currentBeat: LessonBeat | null;
  isPlaying: boolean;
  onGenerateTopic: (topic: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced') => void;
  onAskQuestion: (question: string) => void;
  chatMessages: ChatMessage[];
  isGenerating: boolean;
  isAnswering: boolean;
  userApiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ChatTutorPanel: React.FC<ChatTutorPanelProps> = ({
  lesson,
  currentBeat,
  isPlaying,
  onGenerateTopic,
  onAskQuestion,
  chatMessages,
  isGenerating,
  isAnswering,
  userApiKey,
  onSaveApiKey,
}) => {
  const [inputTopic, setInputTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(userApiKey);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll chat to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAnswering, currentBeat]);

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTopic.trim()) return;
    onGenerateTopic(inputTopic.trim(), difficulty);
    setInputTopic('');
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTopic.trim()) return;
    onAskQuestion(inputTopic.trim());
    setInputTopic('');
  };

  const handleSpeakMessage = (text: string) => {
    speechService.speak(text);
  };

  // Quick suggestion topics
  const suggestions = [
    { title: '⚡ Transformers & Self-Attention', topic: 'Transformers & Self-Attention: The Engine of Modern AI' },
    { title: '🌳 Binary Search Trees', topic: 'Binary Search Trees & Logarithmic Search' },
    { title: '⚛️ Quantum Superposition', topic: 'Quantum Superposition & Entanglement: Beyond Classical Bits' },
    { title: '🛡️ How mRNA Vaccines Work', topic: 'How mRNA Vaccines Train the Immune System' },
    { title: '🔄 Backpropagation', topic: 'Neural Networks and Backpropagation with Gradient Descent' },
  ];

  return (
    <div className="w-full flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
      {/* 1. Header Bar with AI Tutor Persona & Key Modal Button */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
            <Bot className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white tracking-tight">Braynix AI Tutor</h2>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold">
                Voice + Board
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {lesson ? `Teaching: ${lesson.topic.slice(0, 32)}...` : 'Ask me to teach any concept'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowKeyModal(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition ${userApiKey ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'}`}
          title="Configure API Keys (Gemini / OpenAI)"
        >
          <Key className="w-3.5 h-3.5" />
          <span>{userApiKey ? 'API Key Active' : 'API Key (Optional)'}</span>
        </button>
      </div>

      {/* 2. Live Subtitles / Karaoke Bar during Presentation */}
      {currentBeat && isPlaying && (
        <div className="px-4 py-2.5 bg-cyan-950/40 border-b border-cyan-800/40 flex items-start gap-2.5 animate-in fade-in duration-300">
          <div className="flex items-center gap-1 pt-1 text-cyan-400">
            <span className="w-1.5 h-3.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="w-1.5 h-2 rounded-full bg-cyan-300 animate-pulse" />
            <span className="w-1.5 h-4 rounded-full bg-cyan-500 animate-pulse" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 block mb-0.5">
              Live Narration • Beat {currentBeat.beatIndex} / 5: {currentBeat.title}
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{currentBeat.narration}</p>
          </div>
        </div>
      )}

      {/* 3. Chat Messages & Learning Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {/* Tutor Welcome Message */}
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 bg-slate-800/70 border border-slate-700/60 rounded-2xl rounded-tl-sm p-3 text-slate-200 leading-relaxed space-y-2">
            <p className="font-semibold text-cyan-300">Hello! I am your AI Interactive Whiteboard Tutor.</p>
            <p className="text-slate-300">
              I teach any topic with <strong>synchronized voice narration</strong> and <strong>live whiteboard diagrams</strong>.
            </p>
            {!lesson && (
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Try one of our flagship 2-minute masterclasses, or type any topic below:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s.title}
                      type="button"
                      onClick={() => onGenerateTopic(s.topic, 'Intermediate')}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-900/40 hover:text-cyan-200 border border-slate-700/80 text-slate-300 text-[11px] font-medium transition"
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conversation Stream */}
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-cyan-600/30 border border-cyan-500/40 text-cyan-300'}`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3 text-slate-200 leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-blue-600/90 text-white rounded-tr-sm' : 'bg-slate-800/80 border border-slate-700/60 rounded-tl-sm'}`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.sender === 'tutor' && (
                <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-slate-500">{msg.timestamp}</span>
                  <button
                    type="button"
                    onClick={() => handleSpeakMessage(msg.text)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Speak</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator for Lesson Generation */}
        {isGenerating && (
          <div className="flex items-start gap-2.5 animate-pulse">
            <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-slate-800/80 border border-cyan-700/40 rounded-2xl rounded-tl-sm p-3 text-cyan-300 text-xs">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Crafting 2-Minute Synchronized Lesson & Whiteboard Diagrams...</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1">
                Structuring pedagogical curriculum beats, spatial coordinate diagrams, and voice script.
              </p>
            </div>
          </div>
        )}

        {/* Loading Indicator for Follow-up Q&A */}
        {isAnswering && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-sm p-3 text-slate-300 text-xs flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Tutor is formulating explanation and drawing whiteboard visual...</span>
            </div>
          </div>
        )}

        {/* Suggested Follow-up Questions when Lesson is Loaded */}
        {lesson && !isGenerating && !isAnswering && lesson.suggestedQuestions.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              Suggested Follow-Up Questions:
            </span>
            <div className="flex flex-col gap-1.5">
              {lesson.suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onAskQuestion(q)}
                  className="text-left px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-cyan-200 transition text-[11px] leading-snug"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Bottom Input Form: Switch between Topic Entry and Follow-Up Chat */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex flex-col gap-2">
        {!lesson ? (
          /* Initial Topic Prompt Mode */
          <form onSubmit={handleTopicSubmit} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                Enter Any Topic to Teach:
              </span>
              {/* Difficulty selector */}
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${difficulty === d ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputTopic}
                onChange={(e) => setInputTopic(e.target.value)}
                placeholder="e.g. How Transformers Work, CRISPR Gene Editing, Black Holes..."
                disabled={isGenerating}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              />
              <button
                type="submit"
                disabled={!inputTopic.trim() || isGenerating}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Teach Me</span>
              </button>
            </div>
          </form>
        ) : (
          /* Follow-up Q&A Mode */
          <form onSubmit={handleQuestionSubmit} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-medium text-slate-300">Ask a follow-up or request a demonstration:</span>
              <button
                type="button"
                onClick={() => onGenerateTopic('', 'Intermediate')}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                + New Topic
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputTopic}
                onChange={(e) => setInputTopic(e.target.value)}
                placeholder="Ask about this topic (e.g. 'Can you quiz me?' or 'Explain step 2')..."
                disabled={isAnswering}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              />
              <button
                type="submit"
                disabled={!inputTopic.trim() || isAnswering}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs shadow transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 5. API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-md w-full shadow-2xl flex flex-col gap-4 text-xs text-slate-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>AI Configuration & API Key</span>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <p>
                The Braynix Whiteboard Tutor features an <strong>Intelligent Procedural Synthesizer</strong> that generates rich, publication-grade 2-minute whiteboard lessons for any topic with zero API keys required!
              </p>
              <p>
                Optionally, you can connect your own <strong>Google Gemini API key</strong> or <strong>OpenAI API key</strong> for live LLM generation:
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-200">API Key (Gemini or OpenAI):</label>
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIza... or sk-..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500">
                🔒 Keys stay strictly in your browser session or can be configured via environment variables.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setTempKey('');
                  onSaveApiKey('');
                  setShowKeyModal(false);
                }}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                Clear Key
              </button>
              <button
                type="button"
                onClick={() => {
                  onSaveApiKey(tempKey.trim());
                  setShowKeyModal(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
