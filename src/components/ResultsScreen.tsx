import React, { useState } from 'react';
import {
  AnswerSubmission,
  ShuffledQuestion,
  CategoryAccuracy,
  DistributionStats,
} from '../types';
import {
  Award,
  AlertTriangle,
  RotateCcw,
  Printer,
  CheckCircle2,
  XCircle,
  BarChart2,
  BookOpen,
  Filter,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react';

interface ResultsScreenProps {
  score: number;
  totalPoints: number;
  livesRemaining: number;
  maxLives: number;
  submissions: AnswerSubmission[];
  candidateName: string;
  attemptSeed: string;
  stats: DistributionStats;
  onRestart: () => void;
  onOpenAudit: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  totalPoints,
  livesRemaining,
  maxLives,
  submissions,
  candidateName,
  attemptSeed,
  stats,
  onRestart,
  onOpenAudit,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const percentage = Math.round((score / totalPoints) * 100);
  const passingScore = Math.ceil(totalPoints * 0.8);
  const isCertified = percentage >= 80 && livesRemaining > 0;
  const isTerminatedEarly = livesRemaining <= 0;

  // Calculate category breakdown
  const categoryMap = new Map<string, { total: number; correct: number }>();
  for (const sub of submissions) {
    const cat = sub.question.category;
    const current = categoryMap.get(cat) || { total: 0, correct: 0 };
    current.total++;
    if (sub.isCorrect) current.correct++;
    categoryMap.set(cat, current);
  }

  const categoryBreakdown: CategoryAccuracy[] = Array.from(categoryMap.entries()).map(
    ([category, data]) => ({
      category,
      total: data.total,
      correct: data.correct,
      percentage: Math.round((data.correct / data.total) * 100),
    })
  );

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    submissions.forEach((s) => (allExpanded[s.question.originalId] = true));
    setExpandedItems(allExpanded);
  };

  const collapseAll = () => {
    setExpandedItems({});
  };

  // Filtered submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (filterMode === 'incorrect' && sub.isCorrect) return false;
    if (filterMode === 'correct' && !sub.isCorrect) return false;
    if (selectedCategory !== 'all' && sub.question.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div
      id="executive-results-screen"
      className="max-w-5xl mx-auto my-8 px-4 sm:px-6 lg:px-8 print:p-0 print:m-0"
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
        {/* Certificate / Header Banner */}
        <div
          className={`p-6 sm:p-10 text-white border-b ${
            isCertified
              ? 'bg-slate-900 border-slate-800'
              : isTerminatedEarly
              ? 'bg-slate-950 border-rose-950'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider px-3 py-1 rounded bg-white/10 text-slate-200 border border-white/10">
                Official Examination Transcript
              </span>
              <span className="font-mono text-xs text-slate-400">
                Session: {attemptSeed.slice(0, 18)}
              </span>
            </div>

            <div className="flex items-center gap-3 print:hidden">
              <button
                id="results-open-audit-btn"
                onClick={onOpenAudit}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Integrity Audit Log</span>
              </button>
              <button
                id="print-transcript-btn"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Transcript</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-2">
                {isCertified ? (
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                )}
                <span className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-300">
                  Assessment Outcome
                </span>
              </div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                {isCertified
                  ? 'Executive Proficiency Certification Attained'
                  : isTerminatedEarly
                  ? 'Assessment Terminated — Maximum Allowable Infractions Exceeded'
                  : 'Assessment Completed — Below Certification Threshold'}
              </h1>
              <p className="text-slate-300 text-sm mt-2 font-sans">
                Candidate: <strong className="text-white">{candidateName}</strong> • Date:{' '}
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Score Pill */}
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-5 text-center">
              <span className="text-xs uppercase tracking-wider text-slate-300 font-mono block mb-1">
                Final Score
              </span>
              <div className="font-serif font-bold text-4xl sm:text-5xl text-white">
                {score} <span className="text-2xl font-mono text-slate-300">/ {totalPoints}</span>
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-xs font-mono">
                <span
                  className={`px-2 py-0.5 rounded font-semibold ${
                    isCertified
                      ? 'bg-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/30 text-rose-300'
                  }`}
                >
                  {percentage}% Proficiency
                </span>
                <span className="text-slate-400">Target: 80% ({passingScore} pts)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Breakdown */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-xs uppercase font-mono text-slate-500 block mb-1">
                Questions Answered
              </span>
              <span className="font-serif font-bold text-2xl text-slate-900">
                {submissions.length} / {totalPoints}
              </span>
              <span className="text-xs text-slate-500 block mt-1">
                {isTerminatedEarly ? 'Session aborted at life 0' : 'Complete assessment attempted'}
              </span>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-xs uppercase font-mono text-slate-500 block mb-1">
                Lives Remaining
              </span>
              <span className="font-serif font-bold text-2xl text-slate-900">
                {livesRemaining} / {maxLives}
              </span>
              <span className="text-xs text-slate-500 block mt-1">
                {maxLives - livesRemaining} penalty deduction(s) recorded
              </span>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-xs uppercase font-mono text-slate-500 block mb-1">
                Academic Integrity
              </span>
              <span className="font-serif font-bold text-xl text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Fisher-Yates Verified
              </span>
              <span className="text-xs text-slate-500 block mt-1">
                Balanced A/B/C/D positions guaranteed
              </span>
            </div>
          </div>

          {/* Domain Performance Analysis */}
          <div>
            <h3 className="font-serif font-bold text-slate-900 text-lg mb-4">
              Competency Domain Performance Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryBreakdown.map((item) => (
                <div
                  key={item.category}
                  className="p-4 rounded-lg border border-slate-200 bg-white shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sans font-semibold text-sm text-slate-800">
                      {item.category}
                    </span>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        item.percentage >= 80
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.percentage >= 60
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {item.correct}/{item.total} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.percentage >= 80
                          ? 'bg-emerald-600'
                          : item.percentage >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-600'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Item Audit Log */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">
                  Item-by-Item Assessment Transcript & Feedback
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive audit of selected responses, correct options, and academic justifications.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-2 print:hidden">
                <div className="flex items-center rounded-lg border border-slate-300 p-0.5 bg-slate-50 text-xs">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                      filterMode === 'all'
                        ? 'bg-white font-bold text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({submissions.length})
                  </button>
                  <button
                    onClick={() => setFilterMode('incorrect')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                      filterMode === 'incorrect'
                        ? 'bg-white font-bold text-rose-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Incorrect ({submissions.filter((s) => !s.isCorrect).length})
                  </button>
                  <button
                    onClick={() => setFilterMode('correct')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                      filterMode === 'correct'
                        ? 'bg-white font-bold text-emerald-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Correct ({submissions.filter((s) => s.isCorrect).length})
                  </button>
                </div>

                <button
                  onClick={expandAll}
                  className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* List of Questions */}
            <div className="space-y-3">
              {filteredSubmissions.map((sub, idx) => {
                const q = sub.question;
                const isExpanded = !!expandedItems[q.originalId];
                const selectedOpt = q.displayedOptions.find((o) => o.letter === sub.selectedLetter);
                const correctOpt = q.displayedOptions.find((o) => o.letter === q.correctLetter);

                return (
                  <div
                    key={q.originalId}
                    className={`rounded-lg border transition-all ${
                      sub.isCorrect
                        ? 'border-slate-200 bg-white hover:border-slate-300'
                        : 'border-rose-200 bg-rose-50/20 hover:border-rose-300'
                    }`}
                  >
                    {/* Collapsible Bar */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(q.originalId)}
                      className="w-full text-left p-4 flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <span className="shrink-0 mt-0.5">
                          {sub.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-600" />
                          )}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                            <span>Item {idx + 1}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">{q.category}</span>
                          </div>
                          <h4 className="font-serif font-bold text-slate-900 text-sm sm:text-base leading-snug">
                            {q.prompt}
                          </h4>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-sans">
                            <span className="text-slate-600">
                              Your answer:{' '}
                              <strong
                                className={sub.isCorrect ? 'text-emerald-700' : 'text-rose-700'}
                              >
                                [{sub.selectedLetter}]
                              </strong>
                            </span>
                            {!sub.isCorrect && (
                              <span className="text-emerald-700 font-semibold">
                                Correct answer: [{q.correctLetter}]
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="text-slate-400 p-1 shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    </button>

                    {/* Detailed Body (when expanded) */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs font-sans text-slate-800">
                        {/* Displayed options */}
                        <div className="space-y-1.5">
                          <span className="font-mono uppercase font-bold text-slate-500 block mb-1">
                            Option Permutations in this Session:
                          </span>
                          {q.displayedOptions.map((opt) => {
                            const isChosen = opt.letter === sub.selectedLetter;
                            const isCorrectOpt = opt.letter === q.correctLetter;

                            return (
                              <div
                                key={opt.letter}
                                className={`p-2.5 rounded border text-xs flex items-start gap-2.5 ${
                                  isCorrectOpt
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                                    : isChosen
                                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                                    : 'bg-slate-50 border-slate-200 text-slate-600'
                                }`}
                              >
                                <span className="font-mono font-bold w-5">{opt.letter}.</span>
                                <span className="flex-1">{opt.text}</span>
                                {isCorrectOpt && (
                                  <span className="text-emerald-700 font-bold uppercase text-[10px]">
                                    (Correct)
                                  </span>
                                )}
                                {isChosen && !isCorrectOpt && (
                                  <span className="text-rose-700 font-bold uppercase text-[10px]">
                                    (Candidate Selection)
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Rationale */}
                        <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-2">
                          <div>
                            <span className="font-bold text-slate-700 block mb-1">
                              Academic Justification:
                            </span>
                            <p className="font-serif leading-relaxed text-slate-800 text-[13px]">
                              {q.explanation.correctReason}
                            </p>
                          </div>
                          {q.explanation.conceptHighlight && (
                            <div className="pt-2 border-t border-slate-200">
                              <span className="font-bold text-amber-900 block mb-0.5">
                                Executive Concept:
                              </span>
                              <p className="text-amber-950">{q.explanation.conceptHighlight}</p>
                            </div>
                          )}
                          {q.learningObjective && (
                            <div className="text-slate-500 italic pt-1">
                              Objective: {q.learningObjective}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Repeated practice reshuffles questions and regenerates unique option permutations to
              reinforce conceptual mastery.
            </div>

            <button
              id="retake-assessment-button"
              type="button"
              onClick={onRestart}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment (Fresh Permutation)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
