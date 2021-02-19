import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {DbModelPage} from './db-model-page.component';

describe('DbModelPage', () => {
	let component: DbModelPage;
	let fixture: ComponentFixture<DbModelPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [DbModelPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(DbModelPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
