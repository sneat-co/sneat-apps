import { Schema } from '../schema';
import { IRxMutation } from './interfaces';

const RxMutationKind = '$mutation';

export interface IRxMutationSchema extends Schema {
	[RxMutationKind]: {
		key: string;
		value: IRxMutation;
	};
}
