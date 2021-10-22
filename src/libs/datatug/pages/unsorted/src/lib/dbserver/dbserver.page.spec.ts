import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DbserverPage } from './dbserver.page';

describe('DbserverPage', () => {
	let component: DbserverPage;
	let fixture: ComponentFixture<DbserverPage>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [DbserverPage],
				imports: [IonicModule.forRoot()],
			}).compileComponents();

			fixture = TestBed.createComponent(DbserverPage);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
