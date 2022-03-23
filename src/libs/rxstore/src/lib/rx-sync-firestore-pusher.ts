import { IRxStoreProvider, RxMutation } from './interfaces';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { SyncBacklogKind } from './rx-sync-logger';

@Injectable()
export class RxSyncFirestorePusher {
	constructor(
		private readonly rxStoreProvider: IRxStoreProvider<unknown>,
	) {
		console.log('RxSyncFirestorePusher.constructor()');
		rxStoreProvider.rxStore.subscribe(rxStore => {
			console.log('RxSyncFirestorePusher => store:', rxStore);
			rxStore.changed.pipe(
				filter(change => change.kind === SyncBacklogKind
					&& (change.action === RxMutation.add || change.action === RxMutation.update || change.action === RxMutation.put)),
			)
				.subscribe(change => {
					console.log('RxSyncFirestorePusher => change:', change);
				});
		});
	}
}
