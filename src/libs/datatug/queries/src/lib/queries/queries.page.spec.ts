import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {QueriesPage} from './queries.page';

describe('SqlQueriesPage', () => {
	let component: QueriesPage;
	let fixture: ComponentFixture<QueriesPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [QueriesPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(QueriesPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
