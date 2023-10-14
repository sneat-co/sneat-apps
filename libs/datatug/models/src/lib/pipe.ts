export interface ITugPipeOutput {
	output?: { [id: string]: unknown };
}

export interface ITugPipe {
	process(input: { [id: string]: unknown }): ITugPipeOutput;
}
