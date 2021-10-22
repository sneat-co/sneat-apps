export interface IProjectRef {
	readonly storeId: string;
	readonly projectId: string;
}

export interface IProjectItemRef extends IProjectRef {
	readonly id: string;
}

export const equalProjectRef = (a: IProjectRef, b: IProjectRef) =>
	a?.projectId === b?.projectId && a?.storeId === b?.storeId;

export function isValidProjectRef(v: IProjectRef): boolean {
	return !!(v?.storeId && v?.projectId);
}

export function projectRefToString(v?: IProjectRef): string | undefined {
	return v && `${v.projectId}@${v.storeId}`;
}
