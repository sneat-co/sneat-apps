(global as any).Uint8Array = Buffer.from('').constructor.prototype.constructor;

import '@analogjs/vitest-angular/setup-zone';

(global as any).fetch = vi.fn().mockImplementation(() =>
	Promise.resolve({
		json: () => Promise.resolve({}),
		ok: true,
	}),
);
(global as any).Response = vi.fn();
(global as any).Headers = vi.fn();
(global as any).Request = vi.fn();
