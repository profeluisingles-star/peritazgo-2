import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  AlertTriangle,
  Shuffle,
  FileCheck,
  CheckCircle2,
  Users,
  Briefcase,
  Play,
  BarChart2,
} from 'lucide-react';

interface StartScreenProps {
  onStartAssessment: (candidateName: string, selectedQuestionCount: number) => void;
  onOpenAudit: () => void;
  totalQuestionsInBank: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartAssessment,
  onOpenAudit,
  totalQuestionsInBank,
}) => {
  const [candidateName, setCandidateName] = useState('Executive Candidate');
  const [questionCount, setQuestionCount] = useState<number>(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartAssessment(candidateName.trim() || 'Executive Candidate', questionCount);
  };

  return (
    <div
      id="executive-start-screen"
      className="max-w-4xl mx-auto my-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Hero Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-10 border-b border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-mono text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Accredited Executive Assessment
            </div>
            <button
              id="start-screen-audit-btn"
              type="button"
              onClick={onOpenAudit}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Audit Anti-Memorization Protocol</span>
            </button>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white mb-3">
            English Oriented to Business — Executive Assessment
          </h1>
          <p className="text-slate-300 font-sans text-sm sm:text-base leading-relaxed max-w-2xl">
            A standardized, academic evaluation platform designed to assess executive-level
            Business English proficiency across leadership correspondence, commercial negotiations,
            office administration, legal terms, and parliamentary procedure.
          </p>
        </div>

        {/* Assessment Specifications & Integrity Rules */}
        <div className="p-6 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1">
                <Award className="w-4 h-4 text-amber-600" />
                <span>50-Point Standard</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                50 questions, 1 point each. 80% (40/50 points) required to attain the Executive
                Proficiency Certification.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>3-Lives Discipline</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Candidates are allotted 3 lives. Each incorrect selection deducts one life. Session
                terminates early upon three cumulative infractions.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1">
                <Shuffle className="w-4 h-4 text-indigo-600" />
                <span>Anti-Memorization</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fisher-Yates permutations dynamically reorder questions and option positions (A/B/C/D)
                with balanced distribution validation.
              </p>
            </div>
          </div>

          {/* Assessed Competency Domains */}
          <div>
            <h3 className="font-serif font-bold text-slate-900 text-base mb-3">
              Evaluated Executive Competency Domains
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Executive Correspondence & Letter Formatting</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Contract Negotiations & Reciprocal Concessions</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Parliamentary Motions & Executive Meetings</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Call Screening & Diplomatic Voicemail Protocol</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Filing Systems & Document Retention Compliance</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Employment Law, Ethics & 360 Appraisals</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Reading Analysis of Commercial Leases & RFPs</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Inverted Conditionals & Impersonal Passive Grammar</span>
              </div>
            </div>
          </div>

          {/* Assessment Configuration Form */}
          <form
            id="start-assessment-form"
            onSubmit={handleSubmit}
            className="pt-6 border-t border-slate-200 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="candidate-name-input"
                  className="block font-sans text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Candidate Full Name / Title
                </label>
                <input
                  id="candidate-name-input"
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Maria Vance, Operations Director"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Name used to format the official assessment transcript upon completion.
                </span>
              </div>

              <div>
                <label
                  htmlFor="question-count-select"
                  className="block font-sans text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Assessment Scope & Point Scale
                </label>
                <select
                  id="question-count-select"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-slate-800 focus:border-slate-800 bg-white"
                >
                  <option value={50}>
                    Standard Executive Assessment — 50 Questions (50 Points)
                  </option>
                  <option value={25}>
                    Condensed Practice Sprint — 25 Questions (25 Points)
                  </option>
                  <option value={Math.min(totalQuestionsInBank, 70)}>
                    Full Comprehensive Bank — {Math.min(totalQuestionsInBank, 70)} Questions ({Math.min(totalQuestionsInBank, 70)} Points)
                  </option>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Available bank: {totalQuestionsInBank} validated questions.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-slate-800">Academic Protocol:</span> Immediate
                educational rationale and concept highlights will follow each answer confirmation.
              </div>

              <button
                id="commence-assessment-button"
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-sans font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Begin Assessment ({questionCount} Pts)</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
