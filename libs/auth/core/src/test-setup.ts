(global as any).Uint8Array = Buffer.from('').constructor.prototype.constructor;

import 'jest-preset-angular';

(global as any).fetch = jest.fn().mockImplementation(() =>
	Promise.resolve({
		json: () => Promise.resolve({}),
		ok: true,
	}),
);
(global as any).Response = jest.fn();
(global as any).Headers = jest.fn();
(global as any).Request = jest.fn();
