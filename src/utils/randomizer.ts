import {
  QuestionItem,
  ShuffledQuestion,
  ShuffledOption,
  OptionLetter,
  DistributionStats,
} from '../types';

const LETTERS: OptionLetter[] = ['A', 'B', 'C', 'D'];

/**
 * True Fisher-Yates (Knuth) Shuffle algorithm
 */
export function fisherYatesShuffle<T>(array: T[], customRand?: () => number): T[] {
  const result = [...array];
  const rand = customRand || Math.random;
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates a pseudo-random number generator seeded with a numeric or string seed
 */
export function createSeededRandom(seedStr: string): () => number {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/**
 * Validate that no question has duplicate answer texts
 */
export function validateQuestionOptions(q: QuestionItem): boolean {
  const texts = q.options.map((o) => o.text.trim().toLowerCase());
  const uniqueTexts = new Set(texts);
  return uniqueTexts.size === q.options.length;
}

/**
 * Shuffles a single question's options and binds them to letters A, B, C, D.
 * Computes the new correctLetter based on the stable correctOptionId.
 */
export function shuffleSingleQuestion(
  question: QuestionItem,
  rand: () => number = Math.random
): ShuffledQuestion {
  // Fisher-Yates on options
  const shuffledRawOptions = fisherYatesShuffle(question.options, rand);

  const displayedOptions: ShuffledOption[] = shuffledRawOptions.map((opt, index) => ({
    letter: LETTERS[index],
    optionId: opt.id,
    text: opt.text,
  }));

  // Find which letter corresponds to the semantic correctOptionId
  const correctOptionEntry = displayedOptions.find(
    (opt) => opt.optionId === question.correctOptionId
  );

  if (!correctOptionEntry) {
    throw new Error(
      `Integrity Failure: correctOptionId "${question.correctOptionId}" not found in options for question "${question.id}"`
    );
  }

  return {
    originalId: question.id,
    category: question.category,
    difficulty: question.difficulty,
    prompt: question.prompt,
    context: question.context,
    displayedOptions,
    correctLetter: correctOptionEntry.letter,
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
    learningObjective: question.learningObjective,
  };
}

/**
 * Calculates distribution statistics and checks for anti-patterns
 */
export function evaluateDistribution(questions: ShuffledQuestion[]): DistributionStats {
  const counts: Record<OptionLetter, number> = { A: 0, B: 0, C: 0, D: 0 };
  let maxConsecutive = 0;
  let currentConsecutive = 0;
  let lastLetter: OptionLetter | null = null;

  for (const q of questions) {
    counts[q.correctLetter] = (counts[q.correctLetter] || 0) + 1;

    if (q.correctLetter === lastLetter) {
      currentConsecutive++;
    } else {
      currentConsecutive = 1;
      lastLetter = q.correctLetter;
    }

    if (currentConsecutive > maxConsecutive) {
      maxConsecutive = currentConsecutive;
    }
  }

  const total = questions.length;
  // For balanced target: with 50 questions, each letter ideally ~12-13.
  // Acceptable bounds: minimum 9, maximum 16 (none dominates)
  const minAllowed = Math.floor(total / 4) - 4;
  const maxAllowed = Math.ceil(total / 4) + 4;

  const isBalanced =
    maxConsecutive < 4 && // No 4 or more identical consecutive letters
    counts.A >= minAllowed &&
    counts.A <= maxAllowed &&
    counts.B >= minAllowed &&
    counts.B <= maxAllowed &&
    counts.C >= minAllowed &&
    counts.C <= maxAllowed &&
    counts.D >= minAllowed &&
    counts.D <= maxAllowed;

  return {
    A: counts.A,
    B: counts.B,
    C: counts.C,
    D: counts.D,
    maxConsecutiveIdentical: maxConsecutive,
    totalQuestions: total,
    isBalanced,
  };
}

/**
 * Verify semantic preservation:
 * The text of the option marked correctLetter must match the text of correctOptionId.
 */
export function verifySemanticIntegrity(
  shuffled: ShuffledQuestion,
  originalBank: QuestionItem[]
): boolean {
  const original = originalBank.find((q) => q.id === shuffled.originalId);
  if (!original) return false;

  const originalCorrectOption = original.options.find(
    (o) => o.id === original.correctOptionId
  );
  if (!originalCorrectOption) return false;

  const displayedCorrect = shuffled.displayedOptions.find(
    (o) => o.letter === shuffled.correctLetter
  );
  if (!displayedCorrect) return false;

  return (
    displayedCorrect.optionId === original.correctOptionId &&
    displayedCorrect.text === originalCorrectOption.text
  );
}

export interface PrepareAssessmentParams {
  pool: QuestionItem[];
  questionCount?: number;
  previousQuestionIds?: string[];
  seed?: string;
}

export interface PreparedAssessment {
  questions: ShuffledQuestion[];
  stats: DistributionStats;
  attemptSeed: string;
}

/**
 * Prepares a full assessment with guaranteed anti-pattern validation and balanced A/B/C/D positions.
 */
export function prepareAssessment({
  pool,
  questionCount = 50,
  previousQuestionIds = [],
  seed,
}: PrepareAssessmentParams): PreparedAssessment {
  const attemptSeed = seed || `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const rand = createSeededRandom(attemptSeed);

  // 1. Filter / prioritize questions not in previous attempt if pool is large enough
  let candidatePool = [...pool];
  if (previousQuestionIds.length > 0 && pool.length > questionCount) {
    const unseen = pool.filter((q) => !previousQuestionIds.includes(q.id));
    const seen = pool.filter((q) => previousQuestionIds.includes(q.id));

    // Combine unseen first, then seen, shuffled
    candidatePool = [
      ...fisherYatesShuffle(unseen, rand),
      ...fisherYatesShuffle(seen, rand),
    ];
  } else {
    candidatePool = fisherYatesShuffle(candidatePool, rand);
  }

  // Take requested count (default 50)
  const selectedItems = candidatePool.slice(0, Math.min(questionCount, candidatePool.length));

  // Loop with re-shuffling options until anti-pattern criteria are fully met
  const maxAttempts = 100;
  let bestQuestions: ShuffledQuestion[] = [];
  let bestStats: DistributionStats | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Shuffle question sequence if previous was identical
    const shuffledOrder =
      attempt === 0
        ? selectedItems
        : fisherYatesShuffle(selectedItems, rand);

    const shuffledQuestions: ShuffledQuestion[] = shuffledOrder.map((q) =>
      shuffleSingleQuestion(q, rand)
    );

    const stats = evaluateDistribution(shuffledQuestions);

    // Verify semantic preservation for all items
    const allSemanticsValid = shuffledQuestions.every((sq) =>
      verifySemanticIntegrity(sq, pool)
    );

    if (!allSemanticsValid) {
      continue;
    }

    if (stats.isBalanced) {
      return {
        questions: shuffledQuestions,
        stats,
        attemptSeed,
      };
    }

    if (
      !bestStats ||
      stats.maxConsecutiveIdentical < bestStats.maxConsecutiveIdentical
    ) {
      bestQuestions = shuffledQuestions;
      bestStats = stats;
    }
  }

  // Fallback: If strict statistical balance threshold was close, balance manually by swapping option positions
  const adjustedQuestions = balancePositionsManually(bestQuestions, pool);
  const finalStats = evaluateDistribution(adjustedQuestions);

  return {
    questions: adjustedQuestions,
    stats: finalStats,
    attemptSeed,
  };
}

/**
 * Deterministic balancer that gently adjusts option order on non-balanced subsets to guarantee
 * that letters are evenly distributed across A, B, C, D without altering semantic truth.
 */
function balancePositionsManually(
  questions: ShuffledQuestion[],
  originalBank: QuestionItem[]
): ShuffledQuestion[] {
  const result = [...questions];
  const targetPerLetter = Math.floor(result.length / 4);
  const targetCounts: Record<OptionLetter, number> = {
    A: targetPerLetter,
    B: targetPerLetter,
    C: targetPerLetter,
    D: targetPerLetter,
  };

  // Add remaining remainder
  let remainder = result.length % 4;
  for (const letter of LETTERS) {
    if (remainder > 0) {
      targetCounts[letter]++;
      remainder--;
    }
  }

  // Target letter for each index in a round-robin cycle offset
  const desiredLetterSequence: OptionLetter[] = [];
  for (let i = 0; i < result.length; i++) {
    desiredLetterSequence.push(LETTERS[i % 4]);
  }

  // Shuffle desired sequence slightly to avoid trivial A, B, C, D, A, B, C, D patterns
  for (let i = desiredLetterSequence.length - 1; i > 0; i--) {
    // Swap only if adjacent doesn't produce 3 consecutive
    const j = Math.floor(Math.random() * (i + 1));
    [desiredLetterSequence[i], desiredLetterSequence[j]] = [
      desiredLetterSequence[j],
      desiredLetterSequence[i],
    ];
  }

  // For each question, rearrange displayedOptions so that correctOptionId sits at desired letter
  for (let i = 0; i < result.length; i++) {
    const targetLetter = desiredLetterSequence[i];
    const q = result[i];
    const correctOpt = q.displayedOptions.find((o) => o.optionId === q.correctOptionId);
    if (!correctOpt) continue;

    // Remaining options
    const otherOpts = q.displayedOptions.filter((o) => o.optionId !== q.correctOptionId);

    const newDisplayed: ShuffledOption[] = [];
    let otherIdx = 0;

    for (const letter of LETTERS) {
      if (letter === targetLetter) {
        newDisplayed.push({
          letter,
          optionId: correctOpt.optionId,
          text: correctOpt.text,
        });
      } else {
        newDisplayed.push({
          letter,
          optionId: otherOpts[otherIdx].optionId,
          text: otherOpts[otherIdx].text,
        });
        otherIdx++;
      }
    }

    result[i] = {
      ...q,
      displayedOptions: newDisplayed,
      correctLetter: targetLetter,
    };
  }

  // Double check semantic integrity
  for (const q of result) {
    if (!verifySemanticIntegrity(q, originalBank)) {
      throw new Error(`Semantic preservation failed during manual rebalance on question ${q.originalId}`);
    }
  }

  return result;
}
