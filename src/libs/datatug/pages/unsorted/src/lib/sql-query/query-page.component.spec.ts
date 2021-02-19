import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {QueryPage} from './query-page.component';

describe('SqlEditorPage', () => {
	let component: QueryPage;
	let fixture: ComponentFixture<QueryPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [QueryPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(QueryPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
