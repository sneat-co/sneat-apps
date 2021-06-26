import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IProjectRef} from '@sneat/datatug/core';

@Injectable({providedIn: 'root'})
export class ProjectContextService {

	private readonly $current = new BehaviorSubject<IProjectRef | undefined>(undefined);
	public readonly current$ = this.$current.asObservable();

	public get current() {
		return this.$current.value;
	}

	public setCurrent(value: IProjectRef): void {
		console.log('ProjectContextService.setCurrent()', value);
		this.$current.next(value);
	}
}
