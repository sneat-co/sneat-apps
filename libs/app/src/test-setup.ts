(global as unknown as any).Uint8Array =
	Buffer.from('').constructor.prototype.constructor;
// TODO: Above looks like a hack workaround. Can we have a proper fix?
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
