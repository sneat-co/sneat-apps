import {Component} from "@angular/core";
import {IQueryDef} from "@sneat/datatug/models";

interface IQuery {
	id: string
	title?: string
}

@Component({
	selector: 'datatug-queries-menu',
	templateUrl: './queries-menu.component.html',
})
export class QueriesMenuComponent {
	tab: 'queries' | 'project' = 'queries';

	activeQueryId: string = 'query_1';

	queries: IQuery[] = [
		{
			id: 'query_1',
			title: 'Query #1',
		},
		{
			id: 'query_2',
			title: 'Query #2',
		},
	]

	setActiveQuery(id: string): void {
		this.activeQueryId = id;
	}
}
