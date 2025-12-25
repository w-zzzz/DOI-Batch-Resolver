import React, { useState, useRef, useCallback } from 'react';
import { parseReferences } from './utils/parser';
import { fetchDoi } from './services/crossrefService';
import { ReferenceItem, Status } from './types';
import { InputArea } from './components/InputArea';
import { ResultsList } from './components/ResultsList';
import { LucideBookOpen } from 'lucide-react';

// Concurrency limit to prevent rate limiting
const CONCURRENCY_LIMIT = 3;

export default function App() {
  const [items, setItems] = useState<ReferenceItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Ref to track if the process has been cancelled or components unmounted
  const abortControllerRef = useRef<AbortController | null>(null);

  const processQueue = useCallback(async (queueItems: ReferenceItem[], email: string) => {
    // Create a mutable copy of the queue index
    const queue = [...queueItems];
    const resultsMap = new Map<string, Partial<ReferenceItem>>();
    let activeRequests = 0;
    let index = 0;

    const updateItemStatus = (id: string, updates: Partial<ReferenceItem>) => {
      setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    return new Promise<void>((resolve) => {
      const next = async () => {
        // If we are done
        if (index >= queue.length && activeRequests === 0) {
          resolve();
          return;
        }

        // Fill slots up to limit
        while (activeRequests < CONCURRENCY_LIMIT && index < queue.length) {
          const currentItem = queue[index];
          index++;
          activeRequests++;

          // Set to loading
          updateItemStatus(currentItem.id, { status: Status.LOADING });

          // Perform fetch
          fetchDoi(currentItem.cleanQuery, email)
            .then(result => {
              if (result) {
                updateItemStatus(currentItem.id, {
                  status: Status.SUCCESS,
                  doi: result.DOI,
                  title: result.title?.[0] || 'No title available',
                  score: result.score
                });
              } else {
                updateItemStatus(currentItem.id, { status: Status.NOT_FOUND });
              }
            })
            .catch(err => {
              updateItemStatus(currentItem.id, { 
                status: Status.ERROR, 
                errorMessage: err.message 
              });
            })
            .finally(() => {
              activeRequests--;
              next();
            });
        }
      };

      // Start the loop
      next();
    });
  }, []);

  const handleProcess = async (text: string, email: string) => {
    setIsProcessing(true);
    
    // 1. Parse text
    const parsedItems = parseReferences(text);
    
    // 2. Set initial state (all queued)
    const initialItems = parsedItems.map(item => ({ ...item, status: Status.QUEUED }));
    setItems(initialItems);

    // 3. Process queue
    await processQueue(initialItems, email);
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center space-x-3">
          <div className="p-2 bg-brand-500 rounded-lg text-white">
            <LucideBookOpen size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">DOI Batch Resolver</h1>
            <p className="text-xs text-slate-500 mt-1">Powered by Crossref API</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <section className="mb-8">
           <p className="text-slate-600 mb-4">
            Paste your bibliography references below. The tool will parse list items (e.g., [1], [2]) and query the Crossref database to find the matching DOI.
           </p>
           
           <InputArea onProcess={handleProcess} isProcessing={isProcessing} />
        </section>

        <section>
          <ResultsList items={items} />
        </section>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>Data provided by Crossref. Please use respectfully.</p>
      </footer>
    </div>
  );
}
