import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {EnvironmentsPage} from './environments.page';

describe('EnvironmentsPage', () => {
	let component: EnvironmentsPage;
	let fixture: ComponentFixture<EnvironmentsPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [EnvironmentsPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(EnvironmentsPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
