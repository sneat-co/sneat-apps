import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiffPage } from './diff.page';

describe('DiffPage', () => {
	let component: DiffPage;
	let fixture: ComponentFixture<DiffPage>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [DiffPage],
				imports: [IonicModule.forRoot()],
			}).compileComponents();

			fixture = TestBed.createComponent(DiffPage);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
