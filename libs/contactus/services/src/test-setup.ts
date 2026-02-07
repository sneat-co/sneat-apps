// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
	testEnvironmentOptions: {
		errorOnUnknownElements: true,
		errorOnUnknownProperties: true,
	},
};
import '@analogjs/vitest-angular/setup-zone';



if (!global.fetch) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(global as any).fetch = () => Promise.resolve();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(global as any).Request = class {};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(global as any).Response = class {};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(global as any).Headers = class {};
}
