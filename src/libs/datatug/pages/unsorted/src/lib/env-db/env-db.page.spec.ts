import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {EnvDbPage} from './env-db.page';

describe('EnvDbPage', () => {
	let component: EnvDbPage;
	let fixture: ComponentFixture<EnvDbPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [EnvDbPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(EnvDbPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
