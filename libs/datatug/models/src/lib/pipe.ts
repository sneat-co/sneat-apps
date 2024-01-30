export interface ITugPipeOutput {
	output?: Record<string, unknown>;
}

export interface ITugPipe {
	process(input: Record<string, unknown>): ITugPipeOutput;
}
