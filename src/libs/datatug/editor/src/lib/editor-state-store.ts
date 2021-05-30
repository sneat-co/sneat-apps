import {EMPTY, Observable, of} from "rxjs";
import {IQueryStateDto} from "./models";

export interface IEditorStateStore {
	getQueryStateDto(id: string): Observable<IQueryStateDto>;

	saveQueryStateDto(id: string, state: IQueryStateDto): Observable<void>;
}

export class EditorStateStore implements IEditorStateStore {
	readonly states: { [id: string]: IQueryStateDto } = {};

	getQueryStateDto(id: string): Observable<IQueryStateDto> {
		return of(this.states[id]);
	}

	saveQueryStateDto(id: string, state: IQueryStateDto): Observable<never> {
		this.states[id] = state;
		return EMPTY;
	}
}
