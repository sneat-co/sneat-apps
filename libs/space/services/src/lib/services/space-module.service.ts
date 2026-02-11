import { Injector, runInInjectionContext } from '@angular/core';
import {
  collection,
  CollectionReference,
  Firestore as AngularFirestore,
} from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IIdAndBrief, IIdAndOptionalDbo } from '@sneat/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleSpaceItemService } from './space-item.service';

// import firebase from "firebase/compat";
// import Item = firebase.analytics.Item;

export abstract class SpaceModuleService<Dbo> extends ModuleSpaceItemService<
  Dbo,
  Dbo
> {
  // protected readonly sfs: SneatFirestoreService<Brief, Dto>;
  protected constructor(
    injector: Injector,
    moduleID: string,
    afs: AngularFirestore,
  ) {
    // this.sfs = new SneatFirestoreService<Brief, Dto>(collectionName, afs);
    super(
      injector,
      moduleID,
      'ext',
      afs,
      undefined as unknown as SneatApiService,
    );
  }

  watchSpaceModuleRecord(spaceID: string): Observable<IIdAndOptionalDbo<Dbo>> {
    const logPrefix = `SpaceModuleService.watchSpaceModuleRecord(spaceID=${spaceID}, moduleID=${this.moduleID})`;
    console.log(logPrefix);
    return runInInjectionContext(this.injector, () => {
      const collectionRef = collection(
        this.spacesCollection,
        spaceID,
        'ext',
      ) as CollectionReference<Dbo>;
      // if (this.moduleID === 'trackus') {
      // 	return throwError(() => new Error('test error'));
      // }
      return this.sfs
        .watchByID<Dbo>(collectionRef, this.moduleID)
        .pipe
        // tap((o) => console.log(`${logPrefix} =>`, o)),
        ();
    });
  }

  watchBriefs<ItemBrief>(
    spaceID: string,
    getBriefs: (dto?: Dbo) => Readonly<Record<string, ItemBrief>>,
  ): Observable<IIdAndBrief<ItemBrief>[]> {
    const o = this.watchSpaceModuleRecord(spaceID);
    return o.pipe(
      map((teamModule) => {
        const briefs = getBriefs(teamModule?.dbo || undefined);
        const items: IIdAndBrief<ItemBrief>[] = briefs
          ? Object.keys(briefs).map((id) => ({ id, brief: briefs[id] }))
          : [];
        return items;
      }),
    );
  }
}
