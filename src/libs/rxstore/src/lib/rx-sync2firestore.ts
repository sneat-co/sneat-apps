// import {
//     IRecord,
//     IRecordChange,
//     IRxReadonlyTransaction,
//     IRxReadwriteTransaction,
//     IRxStore,
//     IRxStoreProvider
// } from "./interfaces";
// import {Observable} from "rxjs";
// import {map} from "rxjs/operators";
//
// export class RxSyncToFirestoreProvider implements IRxStoreProvider {
//     constructor(
//         private provider: IRxStoreProvider,
//     ) {
//     }
//
//     get rxStore(): Observable<IRxStore> {
//         return this.provider.rxStore.pipe(map(rxStore => new RxSyncToFirestore(rxStore)));
//     }
//
// }
//
// export class RxSyncToFirestore implements IRxStore {
//
//     constructor(
//         private rxStore: IRxStore,
//     ) {
//     }
//
//     public readonly changed: Observable<IRecordChange> = this.rxStore.changed;
//     // get changed(): Observable<IRecordChange> {
//     //     return this.rxStore.changed;
//     // }
//
//     readonly connectionID: number;
//
//     readonlyTransaction(...storeNames: string[]): Observable<IRxReadonlyTransaction> {
//         return this.rxStore.readonlyTransaction(...storeNames);
//     }
//
//     readwriteTransaction(...storeNames: string[]): Observable<IRxReadwriteTransaction> {
//         const tx$ = this.rxStore.readwriteTransaction(...storeNames);
//         return tx$;
//     }
//
//     watchById<T extends IRecord>(kind: string, id: string): Observable<T> {
//         return this.rxStore.watchById(kind, id);
//     }
// }
