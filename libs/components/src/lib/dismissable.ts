export interface IDismissable {
	/**
	 * When `id` is not provided, it dismisses the top overlay.
	 */
	dismiss(data?: unknown, role?: string, id?: string): Promise<boolean>;
}
