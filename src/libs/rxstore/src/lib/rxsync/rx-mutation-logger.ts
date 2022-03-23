import { Observable } from 'rxjs';
import { IRxReadwriteTransaction } from '../interfaces';
import { IRxMutation } from './interfaces';
import { IRxMutationSchema } from './schema';

export interface IRxMutationLogger {
	recordMutation<CustomSchema extends IRxMutationSchema>(tx: IRxReadwriteTransaction<CustomSchema>, mutation: IRxMutation)
		: Observable<IRxMutation>;
}

export class RxMutationLogger implements IRxMutationLogger {
	// tslint:disable-next-line:arrow-return-shorthand
	public readonly recordMutation =
		<CustomSchema extends IRxMutationSchema>(tx: IRxReadwriteTransaction<CustomSchema>, mutation: IRxMutation)
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			: Observable<IRxMutation> => tx.add(RxMutationKind, {
			created: 'now',
			...mutation,
		});
}
