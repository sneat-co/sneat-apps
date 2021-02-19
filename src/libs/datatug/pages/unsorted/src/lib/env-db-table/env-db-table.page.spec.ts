import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {EnvDbTablePage} from './env-db-table.page';

describe('EnvDbTablePage', () => {
	let component: EnvDbTablePage;
	let fixture: ComponentFixture<EnvDbTablePage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [EnvDbTablePage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(EnvDbTablePage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
