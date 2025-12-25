import React from 'react';
import { ReferenceItem, Status } from '../types';
import { LucideExternalLink, LucideCheckCircle, LucideAlertCircle, LucideXCircle, LucideLoader2 } from 'lucide-react';

interface ResultsListProps {
  items: ReferenceItem[];
}

const StatusIcon = ({ status }: { status: Status }) => {
  switch (status) {
    case Status.LOADING:
    case Status.QUEUED:
      return <LucideLoader2 className="animate-spin text-brand-500" size={20} />;
    case Status.SUCCESS:
      return <LucideCheckCircle className="text-green-500" size={20} />;
    case Status.NOT_FOUND:
      return <LucideAlertCircle className="text-amber-500" size={20} />;
    case Status.ERROR:
      return <LucideXCircle className="text-red-500" size={20} />;
    default:
      return <div className="w-5 h-5 rounded-full border-2 border-slate-200" />;
  }
};

export const ResultsList: React.FC<ResultsListProps> = ({ items }) => {
  if (items.length === 0) return null;

  const successCount = items.filter(i => i.status === Status.SUCCESS).length;

  const copyToClipboard = () => {
    // Format: [ID] DOI
    const text = items
      .map((item, idx) => {
        const id = idx + 1;
        const doi = item.status === Status.SUCCESS && item.doi ? `https://doi.org/${item.doi}` : 'Unknown/Unidentified';
        return `[${id}] ${doi}`;
      })
      .join('\n');
    navigator.clipboard.writeText(text);
    alert('Copied results to clipboard!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">
          Results ({successCount} / {items.length} Resolved)
        </h3>
        <button
          onClick={copyToClipboard}
          className="text-xs font-medium bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded transition-colors"
        >
          Copy Results
        </button>
      </div>
      
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex-shrink-0" title={item.status}>
                <StatusIcon status={item.status} />
              </div>
              
              <div className="flex-grow min-w-0">
                {/* Result DOI Section */}
                {item.status === Status.SUCCESS && item.doi ? (
                  <div className="mb-2">
                    <a 
                      href={`https://doi.org/${item.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-brand-600 hover:text-brand-800 font-medium font-mono text-sm break-all"
                    >
                      {item.doi}
                      <LucideExternalLink size={12} className="ml-1" />
                    </a>
                    {item.title && (
                      <p className="text-xs text-slate-500 truncate">{item.title}</p>
                    )}
                  </div>
                ) : (
                  <div className="mb-2">
                     {item.status === Status.NOT_FOUND && (
                       <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                         Unidentified
                       </span>
                     )}
                     {item.status === Status.ERROR && (
                       <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                         Error
                       </span>
                     )}
                     {(item.status === Status.QUEUED || item.status === Status.LOADING) && (
                       <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-brand-50 text-brand-800">
                         Scanning...
                       </span>
                     )}
                  </div>
                )}

                {/* Original Text Section */}
                <p className="text-sm text-slate-600 line-clamp-2 font-serif bg-slate-50 p-2 rounded border border-transparent group-hover:border-slate-200">
                  <span className="text-slate-400 select-none mr-2 text-xs uppercase tracking-wider">Source</span>
                  {item.originalText}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
