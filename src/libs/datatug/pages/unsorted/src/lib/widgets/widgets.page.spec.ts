import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {WidgetsPage} from './widgets.page';

describe('WidgetsPage', () => {
	let component: WidgetsPage;
	let fixture: ComponentFixture<WidgetsPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetsPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(WidgetsPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
