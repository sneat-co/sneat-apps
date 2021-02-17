export interface ITugPipeOutput {
	output?: any;
}

export interface ITugPipe {
	process(input: any): ITugPipeOutput;
}
