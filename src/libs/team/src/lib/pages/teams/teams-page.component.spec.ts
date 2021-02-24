import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {TeamsPage} from './teams-page.component';

describe('HomePage', () => {
	let component: TeamsPage;
	let fixture: ComponentFixture<TeamsPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [TeamsPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(TeamsPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
