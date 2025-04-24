import { IPosthogSettings } from '@sneat/core';
import posthog from 'posthog-js';

export function registerPosthog(settings: IPosthogSettings): void {
	posthog.init(settings.token, {
		...settings.config,
		capture_pageview: false,
	});
}
