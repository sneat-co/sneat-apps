import { IRecord } from '../schema';

// tslint:disable-next-line:no-any
export interface IRxMutation<T = any> extends IRecord {
	code: string;
	data: T;
}

export function mutation<T>(code: string): (data: T) => IRxMutation<T> {
	return (data: T) => {
		const ts = new Date().toISOString();
		return {
			id: ts,
			ts,
			code,
			data,
		};
	};
}
