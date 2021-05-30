export interface ISqlQueryTarget { // should not be here
	repository: string; // Should be removed?
	project: string;	// Should be removed?
	model?: string;
	driver?: string;
	server?: string;
	catalog?: string;
}
