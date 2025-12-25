import React, { useState } from 'react';
import { LucideSearch, LucideSettings } from 'lucide-react';

interface InputAreaProps {
  onProcess: (text: string, email: string) => void;
  isProcessing: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onProcess, isProcessing }) => {
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Default example text from the prompt
  const loadExample = () => {
    const example = `[1] J. Hammer and C. J. L. Newth, "Assessment of thoraco-abdominal asyn chrony," Paediatric Respiratory Reviews, vol. 10, no. 2, pp. 75-80, 2009.
[2] P. -H. Huang, W. -C. Chung, C. -C. Sheu, J. -R. Tsai, and T. -C. Hsiao, "Is 
the asynchronous phase of thoracoabdominal movement a novel feature of 
successful extubation? A preliminary result," in 2021 43rd Annual Inter national Conference of the IEEE Engineering in Medicine & Biology So ciety (EMBC), Mexico, pp. 752-756, 2021.
[3] C. P. Criée, S. Sorichter, H. J. Smith, and A. H. R. J. D. Bencard, "Body 
plethysmography–its principles and clinical use," Respiratory Medicine, 
vol. 105, no. 7, pp. 959-971, 2011.`;
    setText(example);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onProcess(text, email);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-4">
          <label className="text-lg font-semibold text-slate-800">
            Paste References
            <span className="block text-sm font-normal text-slate-500 mt-1">
              Supports format: [1] Author, "Title", Journal...
            </span>
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={loadExample}
              className="text-sm text-brand-600 hover:text-brand-900 underline px-2"
            >
              Load Example
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-brand-100 text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Settings"
            >
              <LucideSettings size={20} />
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email for "Polite" Pool (Optional but Recommended)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="researcher@university.edu"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">
              Crossref requests run faster and more reliably if you identify yourself. Your email is only sent to the Crossref API.
            </p>
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="[1] Reference 1..."
          className="w-full h-64 p-4 border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y mb-4"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isProcessing || !text.trim()}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium transition-all ${
              isProcessing || !text.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <LucideSearch size={20} />
                <span>Resolve DOIs</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
