import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {
	allUserProjectsAsFlatList,
	IDatatugProjectBrief, IDatatugProjectBriefWithStoreRef,
	IDatatugStoreBriefsById, IDatatugUser,
	IProjectAndStore
} from '@sneat/datatug/models';
import {STORE_TYPE_GITHUB} from '@sneat/datatug/core';
import {NavController} from "@ionic/angular";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {DatatugUserService, IDatatugUserState} from "@sneat/datatug/services/base";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {AuthStatus, SneatAuthStateService} from "@sneat/auth";

@Component({
	selector: 'datatug-my-projects',
	templateUrl: './my-datatug-projects.component.html',
	styleUrls: ['./my-datatug-projects.component.scss'],
})
export class MyDatatugProjectsComponent implements OnInit, OnDestroy {

	@Input() title: string;

	public datatugUserState: IDatatugUserState;
	public userRecordLoaded = false;

	public authStatus: AuthStatus;

	private readonly destroyed = new Subject<void>();
	public projects: IProjectAndStore[];
	public demoProjects: IDatatugProjectBriefWithStoreRef[] = [
		{
			id: 'datatug-demo-project@datatug',
			store: {type: STORE_TYPE_GITHUB},
			title: 'DataTug Demo Project @ GitHub'
		},
	];

	public showDemoProjects = true;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navController: NavController,
		private readonly sneatAuthStateService: SneatAuthStateService,
		private readonly datatugUserService: DatatugUserService,
	) {
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	ngOnInit(): void {
		this.datatugUserService.datatugUserState.pipe(
			takeUntil(this.destroyed),
		).subscribe({
			next: datatugUserState => {
				console.log('MyDatatugProjectsComponent.ngOnInit() => datatugUserState:', datatugUserState);
				this.authStatus = datatugUserState?.status;
				this.userRecordLoaded = !!datatugUserState?.record || datatugUserState.record === null;
				const {record} = datatugUserState;
				if (record || record == null) {
					this.projects = allUserProjectsAsFlatList(record?.datatug?.stores);
				}
			},
			error: this.errorLogger.logErrorHandler('Failed to get datatug user state'),
		});
	}

	goProject(item: IProjectAndStore): void {
		const {store} = item;
		this.navController
			.navigateForward(`/store/${store.url || store.type}/project/${item.project.id}`, {state: item})
			.catch(e => this.errorLogger.logError(e, 'Failed to navigate to project page'));
	}
}
