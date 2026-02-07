import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

(global as any).fetch = jest.fn().mockImplementation(() =>
	Promise.resolve({
		json: () => Promise.resolve({}),
		ok: true,
	}),
);
(global as any).Response = jest.fn();
(global as any).Headers = jest.fn();
(global as any).Request = jest.fn();
