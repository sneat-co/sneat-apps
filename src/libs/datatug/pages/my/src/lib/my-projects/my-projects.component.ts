import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {MyBaseCardComponent} from '../my-base-card-component';
import {IDataTugProjectBrief} from '@sneat/datatug/models';
import {GITHUB_REPO} from '@sneat/datatug/core';

@Component({
	selector: 'datatug-my-projects',
	templateUrl: './my-projects.component.html',
	styleUrls: ['./my-projects.component.scss'],
})
export class MyProjectsComponent implements OnChanges {

	@Input() public projects: IDataTugProjectBrief[];
	@ViewChild(MyBaseCardComponent) base: MyBaseCardComponent;

	public demo: boolean;

	goProject(proj: IDataTugProjectBrief): void {
		this.base.navController
			.navigateForward(`/repo/${proj.store.url || proj.store.type}/project/${proj.id}`, {state: {proj}})
			.catch(e => this.base.errorLogger.logError(e, 'Failed to navigate to project page'));
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.projects) {
			this.demo = this.projects?.length === 0;
			if (this.demo) {
				this.projects = [
					{id: 'datatug-demo-project@datatug', store: {type: GITHUB_REPO}, title: 'DataTug Demo Project @ GitHub'},
				];
			}
		}
	}
}
