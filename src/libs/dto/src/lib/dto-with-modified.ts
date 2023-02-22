
export interface IModified {
	readonly at: {seconds: number; nanoseconds: number}
	readonly by: string;
}

export interface IWithModified {
	created: IModified;
	updated: IModified;
	delete?: IModified;
}
