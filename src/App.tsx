import React, { useState, useEffect, useCallback } from 'react';
import { BUSINESS_ENGLISH_QUESTION_BANK } from './data/questionBank';
import {
  GameState,
  ShuffledQuestion,
  AnswerSubmission,
  OptionLetter,
  DistributionStats,
} from './types';
import { prepareAssessment } from './utils/randomizer';
import { Header } from './components/Header';
import { StartScreen } from './components/StartScreen';
import { QuestionCard } from './components/QuestionCard';
import { ResultsScreen } from './components/ResultsScreen';
import { DistributionAuditModal } from './components/DistributionAuditModal';

const MAX_LIVES = 3;

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [candidateName, setCandidateName] = useState<string>('Executive Candidate');
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(50);

  // Active Assessment State
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(MAX_LIVES);
  const [submissions, setSubmissions] = useState<AnswerSubmission[]>([]);
  const [attemptSeed, setAttemptSeed] = useState<string>('');
  const [distributionStats, setDistributionStats] = useState<DistributionStats | null>(null);

  // Tracking previous question IDs to prioritize unseen questions on restart
  const [previousQuestionIds, setPreviousQuestionIds] = useState<string[]>([]);

  // Audit Modal
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  // Start Assessment handler
  const handleStartAssessment = (name: string, count: number) => {
    setCandidateName(name);
    setSelectedQuestionCount(count);

    const prepared = prepareAssessment({
      pool: BUSINESS_ENGLISH_QUESTION_BANK,
      questionCount: count,
      previousQuestionIds,
    });

    setQuestions(prepared.questions);
    setDistributionStats(prepared.stats);
    setAttemptSeed(prepared.attemptSeed);
    setCurrentQuestionIndex(0);
    setScore(0);
    setLives(MAX_LIVES);
    setSubmissions([]);
    setGameState('in_progress');
  };

  // Answer submission
  const handleAnswerSubmitted = useCallback(
    (selectedLetter: OptionLetter, isCorrect: boolean) => {
      const currentQ = questions[currentQuestionIndex];
      if (!currentQ) return;

      const submission: AnswerSubmission = {
        question: currentQ,
        selectedLetter,
        isCorrect,
        timestamp: Date.now(),
      };

      setSubmissions((prev) => [...prev, submission]);

      if (isCorrect) {
        setScore((prev) => prev + 1);
      } else {
        setLives((prev) => Math.max(0, prev - 1));
      }
    },
    [questions, currentQuestionIndex]
  );

  // Proceed to next question or conclude
  const handleProceedNext = useCallback(() => {
    // If lives depleted, terminate session early
    if (lives <= 0) {
      setGameState('game_over');
      return;
    }

    // If last question reached, complete assessment
    if (currentQuestionIndex + 1 >= questions.length) {
      setGameState('completed');
      return;
    }

    // Move to next question
    setCurrentQuestionIndex((prev) => prev + 1);
  }, [lives, currentQuestionIndex, questions.length]);

  // Restart Assessment with fresh Fisher-Yates permutation
  const handleRestart = () => {
    // Save current questions to previousQuestionIds to ensure fresh draw
    const currentIds = questions.map((q) => q.originalId);
    setPreviousQuestionIds(currentIds);

    const prepared = prepareAssessment({
      pool: BUSINESS_ENGLISH_QUESTION_BANK,
      questionCount: selectedQuestionCount,
      previousQuestionIds: currentIds,
    });

    setQuestions(prepared.questions);
    setDistributionStats(prepared.stats);
    setAttemptSeed(prepared.attemptSeed);
    setCurrentQuestionIndex(0);
    setScore(0);
    setLives(MAX_LIVES);
    setSubmissions([]);
    setGameState('in_progress');
  };

  // Return to setup/intro screen
  const handleResetSession = () => {
    if (gameState === 'in_progress') {
      const confirmReset = window.confirm(
        'Are you sure you wish to exit the current assessment? All ongoing progress will be discarded.'
      );
      if (!confirmReset) return;
    }
    setGameState('intro');
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans selection:bg-slate-800 selection:text-amber-300">
      {/* Persistent Header when in active assessment */}
      {gameState === 'in_progress' && currentQuestion && (
        <Header
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          score={score}
          lives={lives}
          maxLives={MAX_LIVES}
          candidateName={candidateName}
          category={currentQuestion.category}
          difficulty={currentQuestion.difficulty}
          onOpenAudit={() => setIsAuditModalOpen(true)}
          onResetSession={handleResetSession}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {gameState === 'intro' && (
          <StartScreen
            onStartAssessment={handleStartAssessment}
            onOpenAudit={() => {
              // Generate a temporary assessment sample for the audit preview
              if (!distributionStats) {
                const sample = prepareAssessment({
                  pool: BUSINESS_ENGLISH_QUESTION_BANK,
                  questionCount: 50,
                });
                setDistributionStats(sample.stats);
                setAttemptSeed(sample.attemptSeed);
              }
              setIsAuditModalOpen(true);
            }}
            totalQuestionsInBank={BUSINESS_ENGLISH_QUESTION_BANK.length}
          />
        )}

        {gameState === 'in_progress' && currentQuestion && (
          <QuestionCard
            key={currentQuestion.originalId}
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswerSubmitted={handleAnswerSubmitted}
            onProceedNext={handleProceedNext}
            isLastQuestion={currentQuestionIndex + 1 === questions.length}
            livesRemaining={lives}
          />
        )}

        {(gameState === 'completed' || gameState === 'game_over') && (
          <ResultsScreen
            score={score}
            totalPoints={questions.length}
            livesRemaining={lives}
            maxLives={MAX_LIVES}
            submissions={submissions}
            candidateName={candidateName}
            attemptSeed={attemptSeed}
            stats={distributionStats || { A: 0, B: 0, C: 0, D: 0, maxConsecutiveIdentical: 0, totalQuestions: 0, isBalanced: true }}
            onRestart={handleRestart}
            onOpenAudit={() => setIsAuditModalOpen(true)}
          />
        )}
      </main>

      {/* Global Academic Integrity Audit Modal */}
      {distributionStats && (
        <DistributionAuditModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          stats={distributionStats}
          attemptSeed={attemptSeed || 'INITIAL_AUDIT_SAMPLE'}
          questionBank={BUSINESS_ENGLISH_QUESTION_BANK}
        />
      )}

      {/* Subtle Corporate Footer */}
      <footer className="border-t border-slate-200 bg-white/60 py-4 text-center text-xs text-slate-500 font-sans print:hidden">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Executive Assessment Board — English Oriented to Business Certification
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Compliant with Fisher-Yates Dynamic Permutation & Semantic ID Preservation
          </span>
        </div>
      </footer>
    </div>
  );
}
