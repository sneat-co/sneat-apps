import { IPipe } from '../interfaces';

export class LookupPipe implements IPipe {
	constructor(
		private readonly data: { [id: string]: string },
		public readonly path: string,
		private readonly sourceProp: string,
		private readonly targetProp: string,
	) {}

	public tunnel(o: unknown): unknown {
		let a = o as { [id: string]: string };
		const v = a[this.sourceProp];
		if (v) {
			const flag = this.data[v];
			if (flag) {
				a = { ...a };
				a[this.targetProp] = flag;
			}
		}
		return a;
	}
}
