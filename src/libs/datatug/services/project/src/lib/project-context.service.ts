import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IProjectContext} from '@sneat/datatug/core';

@Injectable()
export class ProjectContextService {

	private readonly $current = new BehaviorSubject<IProjectContext | undefined>(undefined);
	public readonly current$ = this.$current.asObservable();

	public get current() {
		return this.$current.value;
	}

	public setCurrent(value: IProjectContext): void {
		console.log('ProjectContextService.setCurrent()', value);
		this.$current.next(value);
	}
}
