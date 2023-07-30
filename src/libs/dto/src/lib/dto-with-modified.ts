
export type timestamp = {seconds: number; nanoseconds: number};

export interface IWithCreated {
	readonly createdAt: timestamp;
	readonly createdBy: string;
}

export interface IWithUpdated {
	readonly updatedAt: timestamp;
	readonly updatedBy: string;
}

export interface IWithDeleted {
	readonly deletedAt?: timestamp;
	readonly deletedBy?: string;
}

export interface IWithModified extends IWithCreated, IWithUpdated, IWithDeleted {
}
