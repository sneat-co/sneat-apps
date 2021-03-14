import {Component, Input, OnChanges, ViewChild} from '@angular/core';
import {MyBaseCardComponent} from '../my-base-card-component';
import {IDatatugProjectBrief} from '@sneat/datatug/models';
import {GITHUB_REPO} from '@sneat/datatug/core';

@Component({
	selector: 'datatug-my-projects',
	templateUrl: './my-projects.component.html',
	styleUrls: ['./my-projects.component.scss'],
})
export class MyProjectsComponent {

	@Input() public projects: IDatatugProjectBrief[];
	public demoProjects: IDatatugProjectBrief[] = [
		{
			id: 'datatug-demo-project@datatug',
			store: {type: GITHUB_REPO},
			title: 'DataTug Demo Project @ GitHub'
		},
	];
	@ViewChild(MyBaseCardComponent) base: MyBaseCardComponent;

	public showDemoProjects = true;

	goProject(proj: IDatatugProjectBrief): void {
		this.base.navController
			.navigateForward(`/repo/${proj.store.url || proj.store.type}/project/${proj.id}`, {state: {proj}})
			.catch(e => this.base.errorLogger.logError(e, 'Failed to navigate to project page'));
	}
}
