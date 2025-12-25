import { ReferenceItem, Status } from '../types';

/**
 * Parses raw text input into structured reference items.
 * It assumes references start with a bracketed number like [1], [2].
 * It handles multi-line references by concatenating lines that do not start with a bracket.
 */
export const parseReferences = (text: string): ReferenceItem[] => {
  if (!text) return [];

  const lines = text.split('\n');
  const items: ReferenceItem[] = [];
  
  let currentId = 0;
  let currentBuffer: string[] = [];
  let currentLabel = '';

  // Regex to identify the start of a reference: "[1]", "[10]", etc.
  const startRegex = /^\s*\[(\d+)\]\s*(.*)/;

  const flushBuffer = () => {
    if (currentBuffer.length > 0) {
      // Join lines and clean up extra whitespace (typical PDF copy-paste issue)
      const fullText = currentBuffer.join(' ').replace(/\s+/g, ' ').trim();
      
      // Remove the [1] part for the query to be cleaner for Crossref
      const cleanQuery = fullText.replace(/^\[\d+\]\s*/, '');

      items.push({
        id: `ref-${currentId}`,
        originalText: fullText,
        cleanQuery: cleanQuery,
        status: Status.IDLE,
      });
    }
  };

  lines.forEach((line) => {
    const match = line.match(startRegex);
    if (match) {
      // Previous item is done
      flushBuffer();
      
      // Start new item
      currentId++;
      currentLabel = match[1];
      currentBuffer = [line.trim()];
    } else {
      // Continuation of previous item or garbage text at top
      if (currentId > 0) {
        currentBuffer.push(line.trim());
      }
    }
  });

  // Flush the last item
  flushBuffer();

  return items;
};
