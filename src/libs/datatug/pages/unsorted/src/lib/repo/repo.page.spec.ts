import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {RepoPage} from './repo.page';

describe('AgentPage', () => {
	let component: RepoPage;
	let fixture: ComponentFixture<RepoPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [RepoPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(RepoPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
