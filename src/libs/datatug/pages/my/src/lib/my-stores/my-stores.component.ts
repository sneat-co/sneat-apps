import {Component, Input, ViewChild} from '@angular/core';
import {MyBaseCardComponent} from '../my-base-card-component';
import {IDataTugStoreBrief} from '@sneat/datatug/models';

@Component({
	selector: 'datatug-my-stores',
	templateUrl: './my-stores.component.html',
	styleUrls: ['./my-stores.component.scss'],
})
export class MyStoresComponent {
	@Input() public stores: IDataTugStoreBrief[];
	@ViewChild(MyBaseCardComponent) base: MyBaseCardComponent;

	goRepo(repo: string): void {

	}

	public checkAgent(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
	}

	public openHelp(event: Event, path: 'agent' | 'cloud' | 'github' | 'private-repos'): void {
		event.preventDefault();
		event.stopPropagation();
		window.open('https://datatug.app/' + path, '_blank');
	}
}
