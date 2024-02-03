import { Component } from '@angular/core';

@Component({
	selector: 'sneat-datatug-project-menu',
	templateUrl: './project-menu.component.html',
})
export class ProjectMenuComponent {
	public tab: 'project' | 'queries' | 'boards' = 'project';
}
