(global as unknown as any).Uint8Array =
	Buffer.from('').constructor.prototype.constructor;
// TODO: Above looks like a hack workaround. Can we have a proper fix?
import 'jest-preset-angular';
