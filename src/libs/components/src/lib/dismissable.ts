
export interface IDismissable {
	/**
	 * When `id` is not provided, it dismisses the top overlay.
	 */
	dismiss(data?: any, role?: string, id?: string): Promise<boolean>;

}
