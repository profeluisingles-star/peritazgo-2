export type BusinessCategory =
  | 'Business Correspondence'
  | 'Workplace Vocabulary & Equipment'
  | 'Grammar & Sentence Structure'
  | 'Meetings & Scheduling'
  | 'Professional Telephone Communication'
  | 'Employment & HR Policies'
  | 'Customer Service & Ethics'
  | 'Reading Comprehension'
  | 'Sequencing & Procedures'
  | 'Negotiation & Problem Solving';

export type DifficultyLevel = 'Intermediate' | 'Upper-Intermediate' | 'Advanced Executive';

export type ContextType = 'email' | 'dialogue' | 'memo' | 'scenario' | 'document' | 'phone_call' | 'transcript';

export interface DialogueLine {
  speaker: string;
  role?: string;
  text?: string;
  line?: string;
}

export interface QuestionContext {
  type: ContextType;
  title?: string;
  sender?: string;
  recipient?: string;
  subject?: string;
  date?: string;
  text?: string;
  dialogueLines?: DialogueLine[];
  dialogue?: Array<{ speaker: string; line: string }>;
  documentExcerpt?: string;
}

export interface RawOption {
  id: string; // Stable internal identifier, e.g., 'opt_appointment'
  text: string;
}

export interface QuestionExplanation {
  correctReason: string;
  conceptHighlight: string;
  distractorNotes?: string;
}

export interface QuestionItem {
  id: string;
  category: BusinessCategory;
  difficulty: DifficultyLevel;
  prompt: string;
  context?: QuestionContext;
  options: RawOption[];
  correctOptionId: string; // Source of truth: matches RawOption.id
  explanation: QuestionExplanation;
  learningObjective: string;
}

export type OptionLetter = 'A' | 'B' | 'C' | 'D';

export interface ShuffledOption {
  letter: OptionLetter;
  optionId: string;
  text: string;
}

export interface ShuffledQuestion {
  originalId: string;
  category: BusinessCategory;
  difficulty: DifficultyLevel;
  prompt: string;
  context?: QuestionContext;
  displayedOptions: ShuffledOption[];
  correctLetter: OptionLetter;
  correctOptionId: string;
  explanation: QuestionExplanation;
  learningObjective: string;
}

export interface AnswerSubmission {
  question: ShuffledQuestion;
  questionId?: string;
  selectedOptionId?: string;
  selectedLetter: OptionLetter;
  isCorrect: boolean;
  correctLetter?: OptionLetter;
  correctOptionId?: string;
  timestamp: number;
}

export interface DistributionStats {
  A: number;
  B: number;
  C: number;
  D: number;
  maxConsecutiveIdentical: number;
  totalQuestions: number;
  isBalanced: boolean;
}

export type AssessmentState = 'intro' | 'in_progress' | 'completed' | 'game_over';
export type GameState = AssessmentState;

export interface CategoryAccuracy {
  category: string;
  total: number;
  correct: number;
  percentage: number;
}


export interface PerformanceGrade {
  label: 'Excellent' | 'Very Good' | 'Good' | 'Developing' | 'Needs Review';
  minPercent: number;
  colorClass: string;
  badgeClass: string;
  description: string;
}
