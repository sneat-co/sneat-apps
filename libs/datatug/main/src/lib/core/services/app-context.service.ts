import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum AppCode {
	DataTug = 'datatug',
	// sneatTeam = 'sneatTeam',
}

// export const AppCodes = [AppCode.SneatTeam, AppCode.DataTug] as const;
// type AppCodeType = typeof AppCodes[number];

export interface AppContext {
	readonly appCode: AppCode;
}

@Injectable()
export class AppContextService {
	// TODO: move to common

	private current = new BehaviorSubject<AppContext | undefined>(undefined);
	public readonly currentApp = this.current.asObservable();

	constructor() {
		this.setCurrent(AppCode.DataTug);
	}

	public setCurrent(appCode: AppCode): void {
		if (this.current.value?.appCode !== appCode) {
			this.current.next({ appCode });
		}
	}
}
