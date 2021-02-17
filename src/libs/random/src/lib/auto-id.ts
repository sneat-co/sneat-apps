export class RandomId {
	static newRandomId(len: number = 20): string {
		// Alphanumeric characters
		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		const id: string[] = [];
		for (let i = 0; i < len; i++) {
			id.push(chars.charAt(Math.floor(Math.random() * chars.length)));
		}
		return id.join('');
	}
}
