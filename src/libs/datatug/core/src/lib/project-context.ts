export interface IProjectRef {
	readonly storeId: string;
	readonly projectId: string;
}

export function isValidProjectTargetRef(v: IProjectRef): boolean {
	return !!(v?.storeId && v?.projectId);
}

export function projectRefToString(v?: IProjectRef): string | undefined {
	return v && `${v.projectId}@${v.storeId}`;
}
