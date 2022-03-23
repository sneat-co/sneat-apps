import { EntityKind, SpecificOrUnknownSchema } from 'rxstore/schema';

export type RecordId = string | number;

export interface IRxRecordKey<CustomSchema extends SpecificOrUnknownSchema> {
	readonly kind: EntityKind<CustomSchema>;
	readonly id: RecordId;
	readonly parent?: IRxRecordKey<CustomSchema>;
}

export function rxRecordKeyPath<CustomSchema extends SpecificOrUnknownSchema>(key: IRxRecordKey<CustomSchema>): string {
	const s: string[] = [];
	let k: IRxRecordKey<CustomSchema> | undefined = key;
	while (k) {
		const { id, kind } = k;
		if (s.some(v => v.startsWith(`${kind}:`))) {
			throw new Error(`RxRecordKey has a duplicate reference to kind [${kind}]`);
		}
		s.push(`${kind}:${id}`);
		k = k.parent;
	}
	return s
		.reverse()
		.join('/');
}
