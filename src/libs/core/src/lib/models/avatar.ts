export interface IAvatar {
	readonly gravatar?: string;
	readonly external?: {
		readonly provider?: string;
		readonly url?: string;
	};
}
