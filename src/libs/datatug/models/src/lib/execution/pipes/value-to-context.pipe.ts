import { ITugPipe, ITugPipeOutput } from '../../pipe';
import { IValueToContextPipeDefinition } from '../../definition/pipe-definition';

export class ValueToContextPipe implements ITugPipe {
	constructor(private readonly definition: IValueToContextPipeDefinition) {}

	process(input: any): ITugPipeOutput {
		const from = this.definition.from.split('.');
		let v = input;
		for (const f of from) {
			v = input[f];
		}
		// const {to} = this.definition;
		// const variables = {...(ctx.variables || {})};
		// variables[to] = v;
		return { output: input };
	}
}
