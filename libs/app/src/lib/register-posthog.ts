import { IPosthogSettings } from '@sneat/core';
import posthog, { PostHog } from 'posthog-js';

export function registerPosthog(settings: IPosthogSettings): void {
	// Under NodeNext + ESM, TS can sometimes treat the import as a module namespace.
	// Cast to the declared PostHog interface to access instance methods like init().
	const ph = posthog as unknown as PostHog;
	ph.init(settings.token, {
		...settings.config,
		capture_pageview: false,
	});
}
