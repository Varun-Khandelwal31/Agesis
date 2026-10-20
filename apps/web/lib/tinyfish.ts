/**
 * TinyFish SDK Client Wrapper
 * Uses @tiny-fish/sdk for web agents, search, and page extraction.
 */

import { TinyFish } from "@tiny-fish/sdk";

let clientInstance: TinyFish | null = null;

export function getTinyFishClient(): TinyFish | null {
  const apiKey = process.env.TINYFISH_API_KEY;
  if (!apiKey || apiKey === "tf_xxxxx") {
    return null;
  }

  if (!clientInstance) {
    clientInstance = new TinyFish({
      apiKey,
    });
  }

  return clientInstance;
}

export interface TinyFishSearchResult {
  title: string;
  url: string;
  snippet?: string;
  markdown?: string;
}

/**
 * Execute a TinyFish search query
 */
export async function tinyfishSearch(query: string): Promise<TinyFishSearchResult[]> {
  const client = getTinyFishClient();
  if (!client) {
    return [];
  }

  try {
    const response = await client.search.query({ query });
    if (response && response.results) {
      return response.results.map((r: any) => ({
        title: r.title || "",
        url: r.url || "",
        snippet: r.snippet || r.description || "",
        markdown: r.content || "",
      }));
    }
  } catch (err) {
    console.warn(`[TinyFish] Search failed for query "${query}":`, err);
  }

  return [];
}

/**
 * Fetch and extract clean markdown content from a URL via TinyFish
 */
export async function tinyfishFetch(url: string): Promise<{ content: string; status: number }> {
  const client = getTinyFishClient();
  if (!client) {
    return { content: "", status: 0 };
  }

  try {
    const response = await client.fetch.getContents({
      urls: [url],
      format: "markdown",
    });

    if (response && response.results && response.results.length > 0) {
      const res = response.results[0];
      return {
        content: (res as any).content || (res as any).text || "",
        status: 200,
      };
    }
  } catch (err) {
    console.warn(`[TinyFish] Fetch failed for "${url}":`, err);
  }

  return { content: "", status: 500 };
}
