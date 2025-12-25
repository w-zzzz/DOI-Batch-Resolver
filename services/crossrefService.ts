import { CrossrefResponse, CrossrefWork } from '../types';

const CROSSREF_API_URL = 'https://api.crossref.org/works';

/**
 * Fetches the best match DOI for a given bibliographic string.
 * @param query The reference text to search for
 * @param email (Optional) Email for the "Polite" pool
 */
export const fetchDoi = async (query: string, email?: string): Promise<CrossrefWork | null> => {
  const url = new URL(CROSSREF_API_URL);
  
  // 'query.bibliographic' is the best field for unstructured reference strings
  url.searchParams.append('query.bibliographic', query);
  url.searchParams.append('rows', '1'); // We only want the top match
  
  // Use 'select' to reduce payload size
  url.searchParams.append('select', 'DOI,title,score,container-title,author,published');

  if (email && email.includes('@')) {
    url.searchParams.append('mailto', email);
  }

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: CrossrefResponse = await response.json();

    if (data.message.items.length > 0) {
      return data.message.items[0];
    }
    return null;
  } catch (error) {
    console.error("Crossref fetch error:", error);
    throw error;
  }
};
