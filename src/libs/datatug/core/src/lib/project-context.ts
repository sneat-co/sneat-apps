export interface IDatatugProjRef {
	readonly storeId: string;
	readonly projectId: string;
}

export function isValidProjectTargetRef(v: IDatatugProjRef): boolean {
	return !!(v?.storeId && v?.projectId);
}

export function projectRefToString(v?: IDatatugProjRef): string | undefined {
	return v && `${v.projectId}@${v.storeId}`;
}
