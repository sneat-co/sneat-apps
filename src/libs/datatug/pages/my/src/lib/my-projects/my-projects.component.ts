import {Component, Input, OnChanges, ViewChild} from '@angular/core';
import {MyBaseCardComponent} from '../my-base-card-component';
import {IDataTugProjectBrief} from '@sneat/datatug/models';
import {GITHUB_REPO} from '@sneat/datatug/core';

@Component({
	selector: 'datatug-my-projects',
	templateUrl: './my-projects.component.html',
	styleUrls: ['./my-projects.component.scss'],
})
export class MyProjectsComponent {

	@Input() public projects: IDataTugProjectBrief[];
	public demoProjects: IDataTugProjectBrief[] = [
		{
			id: 'datatug-demo-project@datatug',
			store: {type: GITHUB_REPO},
			title: 'DataTug Demo Project @ GitHub'
		},
	];
	@ViewChild(MyBaseCardComponent) base: MyBaseCardComponent;

	public showDemoProjects = true;

	goProject(proj: IDataTugProjectBrief): void {
		this.base.navController
			.navigateForward(`/repo/${proj.store.url || proj.store.type}/project/${proj.id}`, {state: {proj}})
			.catch(e => this.base.errorLogger.logError(e, 'Failed to navigate to project page'));
	}
}
