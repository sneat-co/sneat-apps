import {Component, Inject, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {
	allUserStoresAsFlatList,
	IDatatugStoreBrief,
	IDatatugStoreBriefsById,
	IDatatugUser
} from '@sneat/datatug/models';
import {AgentStateService, IAgentState} from "@sneat/datatug/services/repo";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {DatatugNavService} from "@sneat/datatug/services/nav";
import {NavController} from "@ionic/angular";

@Component({
	selector: 'datatug-my-stores',
	templateUrl: './my-stores.component.html',
	styleUrls: ['./my-stores.component.scss'],
})
export class MyStoresComponent implements OnChanges, OnDestroy {

	@Input() public datatugUser: IDatatugUser;

	public stores: IDatatugStoreBrief[];

	public agentState: IAgentState;

	private readonly destroyed = new Subject<void>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navController: NavController,
		readonly agentStateService: AgentStateService,
		private readonly datatugNavService: DatatugNavService,
	) {
		agentStateService.getAgentInfo('localhost:8989')
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: agentState => {
					console.log('agent state:', agentState);
					this.agentState = agentState;
				},
				error: error => {
					this.errorLogger.logError(error, 'failed to get agent state');
				}
			});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.datatugUser) {
			this.stores = allUserStoresAsFlatList(this.datatugUser?.datatug?.stores);
		}
    }

	ngOnDestroy() {
		this.destroyed.next();
		this.destroyed.complete();
	}

	goStore(id: string): void {
		this.datatugNavService.goStore({id});
	}

	public checkAgent(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
	}

	public openHelp(event: Event, path: 'agent' | 'cloud' | 'github.com' | 'private-repos'): void {
		event.preventDefault();
		event.stopPropagation();
		window.open('https://datatug.app/' + path, '_blank');
	}
}
