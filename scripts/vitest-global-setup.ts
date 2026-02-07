if (typeof window !== 'undefined') {
	if (!window.performance) {
		(window as any).performance = {
			now: () => Date.now(),
			mark: () => {},
			measure: () => {},
			getEntriesByName: () => [],
		};
	}
	if (!window.matchMedia) {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: (query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false,
			}),
		});
	}

	// Stencil/Ionic requirements
	if (!window.CSS) {
		(window as any).CSS = {
			supports: () => false,
		};
	}

	if (!window.customElements) {
		(window as any).customElements = {
			define: () => {},
			get: () => {},
			whenDefined: () => Promise.resolve(),
			upgrade: () => {},
		};
	}
}
