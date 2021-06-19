import {Component, Input, OnChanges, ViewChild} from '@angular/core';
import {MyBaseCardComponent} from '../my-base-card-component';
import {IDatatugProjectBrief, IProjectAndStore} from '@sneat/datatug/models';
import {GITHUB_REPO} from '@sneat/datatug/core';

@Component({
	selector: 'datatug-my-projects',
	templateUrl: './my-projects.component.html',
	styleUrls: ['./my-projects.component.scss'],
})
export class MyProjectsComponent {

	@Input() title: string;

	@Input() public projects: IProjectAndStore[];
	public demoProjects: IDatatugProjectBrief[] = [
		{
			id: 'datatug-demo-project@datatug',
			store: {type: GITHUB_REPO},
			title: 'DataTug Demo Project @ GitHub'
		},
	];
	@ViewChild(MyBaseCardComponent) base: MyBaseCardComponent;

	public showDemoProjects = true;

	goProject(item: IProjectAndStore): void {
		const store = item.store || item.project.store;
		this.base.navController
			.navigateForward(`/store/${store.url || store.type}/project/${item.project.id}`, {state: item})
			.catch(e => this.base.errorLogger.logError(e, 'Failed to navigate to project page'));
	}
}
