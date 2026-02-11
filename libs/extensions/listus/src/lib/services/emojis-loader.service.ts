import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * Service to lazy load emoji data and provide emoji detection functionality.
 * This reduces the initial bundle size by loading emoji data on-demand.
 */
@Injectable({ providedIn: 'root' })
export class EmojisLoaderService {
  private readonly http = inject(HttpClient);
  private emojiByKeyword?: Record<string, string>;
  private loadPromise?: Promise<void>;

  /**
   * Loads emoji data from JSON file and builds the keyword lookup map.
   * Subsequent calls return the same promise (singleton pattern).
   */
  private async loadEmojis(): Promise<void> {
    if (this.emojiByKeyword) {
      return; // Already loaded
    }

    if (!this.loadPromise) {
      this.loadPromise = (async () => {
        try {
          const emojiKeywords = await firstValueFrom(
            this.http.get<[string, string[]][]>('assets/data/emojis.json'),
          );

          // Build keyword to emoji map
          this.emojiByKeyword = {};
          emojiKeywords
            .filter((item) => item[0] && item[1] && item[1].length)
            .forEach((item) => {
              item[1]
                .filter((kw) => !!kw)
                .forEach((kw) => {
                  this.emojiByKeyword![kw] = item[0];
                });
            });
        } catch (error) {
          console.error('Failed to load emojis:', error);
          this.emojiByKeyword = {}; // Set to empty to avoid repeated failures
        }
      })();
    }

    return this.loadPromise;
  }

  /**
   * Detects emoji from a string by looking for keywords.
   * Automatically loads emoji data if not yet loaded.
   *
   * @param s - Input string to search for emoji keywords
   * @returns The detected emoji or undefined if no match found
   */
  async detectEmoji(s?: string): Promise<string | undefined> {
    await this.loadEmojis();

    if (!s || !this.emojiByKeyword) {
      return undefined;
    }

    const words = s.toLowerCase().split(' ');
    for (const word of words) {
      const emoji = this.emojiByKeyword[word];
      if (emoji) {
        return emoji;
      }
    }
    return undefined;
  }
}
