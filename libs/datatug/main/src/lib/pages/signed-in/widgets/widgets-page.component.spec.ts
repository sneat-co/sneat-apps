import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WidgetsPageComponent } from './widgets-page.component';

describe('WidgetsPage', () => {
	let component: WidgetsPageComponent;
	let fixture: ComponentFixture<WidgetsPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [WidgetsPageComponent, IonicModule.forRoot()]}).compileComponents();

		fixture = TestBed.createComponent(WidgetsPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
