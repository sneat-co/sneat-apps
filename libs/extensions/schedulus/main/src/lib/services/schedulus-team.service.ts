import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { ISchedulusTeamDto } from '@sneat/team-models';
import { TeamModuleService } from '@sneat/team-services';

@Injectable({ providedIn: 'root' }) // TODO: Do not provide in root
export class SchedulusTeamService extends TeamModuleService<ISchedulusTeamDto> {
	public constructor(afs: AngularFirestore) {
		super('schedulus', afs);
	}
}
