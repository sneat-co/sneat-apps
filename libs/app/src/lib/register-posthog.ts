import { IPosthogSettings } from '@sneat/core';
import posthog from 'posthog-js';

export function registerPosthog(settings: IPosthogSettings): void {
  // Under NodeNext + ESM, TS can sometimes treat the import as a module namespace.
  // Cast to the declared PostHog interface to access instance methods like init().
  // (posthog as unknown as PostHog)
  posthog.init(settings.token, {
    ...settings.config,
    capture_pageview: false,
  });
}
