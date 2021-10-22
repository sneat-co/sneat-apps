import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnvironmentPageComponent } from './environment-page.component';

describe('EnvironmentPage', () => {
	let component: EnvironmentPageComponent;
	let fixture: ComponentFixture<EnvironmentPageComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [EnvironmentPageComponent],
				imports: [IonicModule.forRoot()],
			}).compileComponents();

			fixture = TestBed.createComponent(EnvironmentPageComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
