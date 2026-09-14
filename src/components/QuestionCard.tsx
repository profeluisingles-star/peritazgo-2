import React, { useState, useEffect } from 'react';
import { ShuffledQuestion, ShuffledOption, OptionLetter } from '../types';
import { DocumentContextViewer } from './DocumentContextViewer';
import { CheckCircle2, XCircle, ArrowRight, BookOpen, Lightbulb, Target, Check, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  question: ShuffledQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSubmitted: (selectedLetter: OptionLetter, isCorrect: boolean) => void;
  onProceedNext: () => void;
  isLastQuestion: boolean;
  livesRemaining: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSubmitted,
  onProceedNext,
  isLastQuestion,
  livesRemaining,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<OptionLetter | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Reset local state when question changes
  useEffect(() => {
    setSelectedLetter(null);
    setIsSubmitted(false);
  }, [question.originalId]);

  // Keyboard shortcut listener for A, B, C, D and Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onProceedNext();
        }
        return;
      }

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        setSelectedLetter(key as OptionLetter);
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const mapping: Record<string, OptionLetter> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
        setSelectedLetter(mapping[e.key]);
      } else if ((e.key === 'Enter' || e.key === ' ') && selectedLetter) {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, selectedLetter, onProceedNext]);

  const handleSubmit = () => {
    if (!selectedLetter || isSubmitted) return;
    setIsSubmitted(true);
    const isCorrect = selectedLetter === question.correctLetter;
    onAnswerSubmitted(selectedLetter, isCorrect);
  };

  const isCorrect = isSubmitted && selectedLetter === question.correctLetter;

  return (
    <div
      id={`question-card-${questionNumber}`}
      className="max-w-4xl mx-auto my-6 px-4 sm:px-6"
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 transition-all">
        {/* Domain & Competency header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Item {questionNumber} / {totalQuestions}
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold text-slate-700">{question.category}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
            <span>Objective: {question.difficulty}</span>
          </div>
        </div>

        {/* Document or Scenario Context (if provided) */}
        {question.context && <DocumentContextViewer context={question.context} />}

        {/* Question Prompt */}
        <div className="mb-6">
          <h2
            id="question-prompt-text"
            className="font-serif font-bold text-slate-900 text-lg sm:text-xl leading-snug tracking-tight"
          >
            {question.prompt}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Select the most appropriate executive response or standard administrative practice.
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-6" role="radiogroup" aria-label="Answer options">
          {question.displayedOptions.map((option) => {
            const isSelected = selectedLetter === option.letter;
            const isThisOptionCorrect = question.correctLetter === option.letter;

            let optionStyle =
              'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50/70 text-slate-800';
            let badgeStyle = 'bg-slate-100 border-slate-300 text-slate-700';

            if (isSubmitted) {
              if (isThisOptionCorrect) {
                // Correct answer highlighted in emerald
                optionStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500';
                badgeStyle = 'bg-emerald-600 border-emerald-700 text-white font-bold';
              } else if (isSelected && !isThisOptionCorrect) {
                // Wrong chosen answer in red
                optionStyle = 'border-rose-400 bg-rose-50/70 text-rose-950 ring-1 ring-rose-400';
                badgeStyle = 'bg-rose-600 border-rose-700 text-white font-bold';
              } else {
                // Other options muted
                optionStyle = 'border-slate-200 bg-slate-50/40 text-slate-400 opacity-60';
                badgeStyle = 'bg-slate-100 border-slate-200 text-slate-400';
              }
            } else if (isSelected) {
              // Active selection before submission
              optionStyle = 'border-slate-800 bg-slate-50/90 text-slate-950 ring-2 ring-slate-800 shadow-xs';
              badgeStyle = 'bg-slate-900 border-slate-900 text-amber-400 font-bold';
            }

            return (
              <button
                key={option.letter}
                id={`option-choice-${option.letter.toLowerCase()}`}
                type="button"
                disabled={isSubmitted}
                onClick={() => setSelectedLetter(option.letter)}
                className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <span
                  className={`w-8 h-8 rounded-md flex items-center justify-center font-mono font-bold text-sm shrink-0 border transition-colors ${badgeStyle}`}
                >
                  {option.letter}
                </span>
                <div className="flex-1 pt-0.5">
                  <span className="font-sans text-[15px] leading-relaxed block">
                    {option.text}
                  </span>
                </div>
                {isSubmitted && isThisOptionCorrect && (
                  <span className="shrink-0 pt-1 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                )}
                {isSubmitted && isSelected && !isThisOptionCorrect && (
                  <span className="shrink-0 pt-1 text-rose-600">
                    <XCircle className="w-5 h-5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls: Submit or Proceed */}
        {!isSubmitted ? (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Tip: Press key <kbd className="px-1.5 py-0.5 border rounded bg-slate-50 font-mono text-[11px]">A</kbd>, <kbd className="px-1.5 py-0.5 border rounded bg-slate-50 font-mono text-[11px]">B</kbd>, <kbd className="px-1.5 py-0.5 border rounded bg-slate-50 font-mono text-[11px]">C</kbd>, or <kbd className="px-1.5 py-0.5 border rounded bg-slate-50 font-mono text-[11px]">D</kbd> to select
            </span>
            <button
              id="submit-answer-button"
              type="button"
              disabled={!selectedLetter}
              onClick={handleSubmit}
              className={`ml-auto px-6 py-2.5 rounded-lg font-sans font-medium text-sm transition-all cursor-pointer ${
                selectedLetter
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Confirm & Submit Answer
            </button>
          </div>
        ) : (
          /* Mandatory Educational Feedback Section */
          <div
            id="educational-feedback-container"
            className={`mt-6 pt-6 border-t ${
              isCorrect ? 'border-emerald-200' : 'border-rose-200'
            }`}
          >
            {/* Outcome Banner */}
            <div
              className={`p-4 rounded-lg flex items-center justify-between mb-4 ${
                isCorrect
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                )}
                <div>
                  <h3 className="font-sans font-bold text-sm">
                    {isCorrect
                      ? 'Accurate Executive Selection (+1 Point)'
                      : `Incorrect Selection — 1 Life Deducted (${livesRemaining} Remaining)`}
                  </h3>
                  <p className="text-xs opacity-90 mt-0.5">
                    {isCorrect
                      ? `Option [${question.correctLetter}] is academically and professionally sound.`
                      : `The recommended executive answer is Option [${question.correctLetter}].`}
                  </p>
                </div>
              </div>

              <span
                className={`font-mono font-bold text-xs px-2.5 py-1 rounded uppercase tracking-wider ${
                  isCorrect
                    ? 'bg-emerald-200/80 text-emerald-900'
                    : 'bg-rose-200/80 text-rose-900'
                }`}
              >
                {isCorrect ? '+1 Pt' : '-1 Life'}
              </span>
            </div>

            {/* Academic Explanation Breakdown */}
            <div className="space-y-4 bg-slate-50 rounded-lg p-5 border border-slate-200 text-slate-800 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  <BookOpen className="w-4 h-4 text-slate-700" />
                  <span>Academic Justification & Analysis</span>
                </div>
                <p className="font-serif text-[14.5px] leading-relaxed text-slate-800">
                  {question.explanation.correctReason}
                </p>
              </div>

              {/* Concept Highlight */}
              {question.explanation.conceptHighlight && (
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-md">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                    <Lightbulb className="w-4 h-4 text-amber-700" />
                    <span>Executive Principle</span>
                  </div>
                  <p className="font-sans text-xs text-amber-950 leading-relaxed font-medium">
                    {question.explanation.conceptHighlight}
                  </p>
                </div>
              )}

              {/* Learning Objective */}
              {question.learningObjective && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                  <Target className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-medium">Learning Competency:</span>
                  <span className="italic text-slate-700">{question.learningObjective}</span>
                </div>
              )}
            </div>

            {/* Next Question Navigation */}
            <div className="flex justify-end items-center gap-4">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 border rounded bg-slate-100 font-mono text-[11px]">Enter</kbd> or <kbd className="px-1.5 py-0.5 border rounded bg-slate-100 font-mono text-[11px]">Space</kbd> to proceed
              </span>
              <button
                id="proceed-next-question-button"
                type="button"
                onClick={onProceedNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors cursor-pointer shadow-xs"
              >
                <span>
                  {livesRemaining <= 0
                    ? 'View Diagnostic Evaluation'
                    : isLastQuestion
                    ? 'Complete Assessment & Generate Certification'
                    : `Next Question (${questionNumber + 1}/${totalQuestions})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
