import React from 'react';
import { Heart, ShieldCheck, Award, BarChart2, RotateCcw } from 'lucide-react';
import { OptionLetter } from '../types';

interface HeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  lives: number;
  maxLives: number;
  candidateName?: string;
  onOpenAudit: () => void;
  onResetSession: () => void;
  category?: string;
  difficulty?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentQuestionIndex,
  totalQuestions,
  score,
  lives,
  maxLives,
  candidateName,
  onOpenAudit,
  onResetSession,
  category,
  difficulty,
}) => {
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <header
      id="executive-assessment-header"
      className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs transition-all"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Identity & Critical Status */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-slate-900 flex items-center justify-center text-amber-400 font-serif font-bold text-lg shadow-xs border border-slate-700">
              BE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold tracking-tight text-slate-900 text-base sm:text-lg leading-tight">
                  Business English Executive Assessment
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  Standard 50 Pts
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans hidden sm:block">
                Professional Board Certification Examination • Fisher-Yates Dynamic Permutation
              </p>
            </div>
          </div>

          {/* Right Status Controls: Lives & Score & Audit */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Lives Indicator */}
            <div
              id="assessment-lives-counter"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50"
              title={`${lives} of ${maxLives} attempts remaining before mandatory failure`}
            >
              <span className="text-xs font-semibold text-slate-600 mr-1 uppercase tracking-wider hidden xs:inline">
                Lives:
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: maxLives }).map((_, i) => {
                  const isActive = i < lives;
                  return (
                    <span
                      key={i}
                      className={`inline-flex transition-transform duration-300 ${
                        isActive ? 'scale-100' : 'scale-90 opacity-30 grayscale'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          isActive
                            ? 'text-rose-600 fill-rose-600'
                            : 'text-slate-400 fill-slate-200'
                        }`}
                      />
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Score Display */}
            <div
              id="assessment-score-tracker"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-bold text-sm sm:text-base text-slate-900">
                  {score}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  / {totalQuestions} pts
                </span>
              </div>
            </div>

            {/* Integrity Audit Trigger */}
            <button
              id="open-audit-button"
              onClick={onOpenAudit}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Inspect Academic Integrity & Answer Distribution"
            >
              <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Integrity Audit</span>
            </button>

            {/* Reset / Quit session button */}
            <button
              id="reset-session-button"
              onClick={onResetSession}
              className="text-xs text-slate-500 hover:text-rose-600 p-1.5 rounded hover:bg-slate-100 transition-colors"
              title="Restart Assessment Session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Sub-bar: Progress Tracker & Question metadata */}
        <div className="py-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono font-semibold text-slate-800">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            {category && (
              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                {category}
              </span>
            )}
            {difficulty && (
              <span className="text-slate-500 hidden md:inline">
                Level: <strong className="text-slate-700">{difficulty}</strong>
              </span>
            )}
          </div>

          {/* Progress Bar Container */}
          <div className="flex items-center gap-2 sm:w-64">
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                id="assessment-progress-indicator"
                className="bg-slate-800 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-slate-500 text-[11px] min-w-[34px] text-right">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
