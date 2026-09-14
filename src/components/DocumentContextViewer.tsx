import React from 'react';
import { QuestionContext } from '../types';
import { FileText, Mail, PhoneCall, MessageSquare, AlertCircle } from 'lucide-react';

interface DocumentContextViewerProps {
  context: QuestionContext;
}

export const DocumentContextViewer: React.FC<DocumentContextViewerProps> = ({ context }) => {
  if (context.type === 'email') {
    return (
      <div
        id="email-document-context"
        className="mb-6 rounded-lg border border-slate-300 bg-slate-50/80 p-4 font-sans text-sm text-slate-800 shadow-xs"
      >
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3 text-xs text-slate-500 font-medium">
          <Mail className="w-4 h-4 text-slate-600" />
          <span className="uppercase tracking-wider">Enterprise Communication Archive</span>
        </div>
        <div className="grid grid-cols-1 gap-1 text-xs text-slate-600 mb-3 border-b border-slate-200 pb-2">
          {context.sender && (
            <div className="flex">
              <span className="w-16 font-semibold text-slate-700">From:</span>
              <span className="text-slate-900 font-mono text-xs">{context.sender}</span>
            </div>
          )}
          {context.recipient && (
            <div className="flex">
              <span className="w-16 font-semibold text-slate-700">To:</span>
              <span className="text-slate-900 font-mono text-xs">{context.recipient}</span>
            </div>
          )}
          {context.subject && (
            <div className="flex">
              <span className="w-16 font-semibold text-slate-700">Subject:</span>
              <span className="text-slate-900 font-semibold">{context.subject}</span>
            </div>
          )}
        </div>
        <div className="font-serif leading-relaxed text-slate-800 whitespace-pre-line text-[15px]">
          {context.body}
        </div>
      </div>
    );
  }

  if (context.type === 'document') {
    return (
      <div
        id="official-document-context"
        className="mb-6 rounded-lg border border-amber-900/20 bg-[#fbf9f5] p-5 shadow-xs"
      >
        <div className="flex items-center justify-between border-b border-amber-900/10 pb-2.5 mb-3.5">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-900" />
            <h4 className="font-serif font-semibold text-sm text-slate-900 tracking-wide">
              {context.title || 'Official Business Record / Contract Excerpt'}
            </h4>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 rounded">
            Confidential
          </span>
        </div>
        <div className="font-serif text-[14.5px] leading-relaxed text-slate-800 border-l-2 border-amber-700/60 pl-3.5 italic bg-amber-50/50 py-2 pr-2">
          "{context.documentExcerpt}"
        </div>
      </div>
    );
  }

  if (context.type === 'transcript') {
    return (
      <div
        id="transcript-context"
        className="mb-6 rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm"
      >
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3 text-xs text-slate-500 font-medium">
          <PhoneCall className="w-4 h-4 text-emerald-700" />
          <span className="uppercase tracking-wider">Audio / Call Recording Transcript</span>
        </div>
        <div className="space-y-2.5">
          {context.dialogue?.map((turn, idx) => (
            <div key={idx} className="flex gap-3 text-[14px]">
              <span className="font-mono text-xs font-semibold text-slate-700 min-w-[90px] pt-0.5">
                {turn.speaker}:
              </span>
              <span className="font-sans text-slate-800 leading-normal">{turn.line}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Generic scenario
  return (
    <div
      id="scenario-context"
      className="mb-6 rounded-lg border border-slate-200 bg-slate-50/90 p-4 text-slate-800"
    >
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-2.5 text-xs text-slate-500 font-medium">
        <AlertCircle className="w-4 h-4 text-slate-600" />
        <span className="uppercase tracking-wider">Operational Scenario</span>
      </div>
      <p className="font-serif text-[14.5px] leading-relaxed text-slate-700 whitespace-pre-line">
        {context.text}
      </p>
    </div>
  );
};
