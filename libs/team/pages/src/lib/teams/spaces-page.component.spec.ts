import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpacesPageComponent } from './spaces-page.component';

describe('HomePage', () => {
	let component: SpacesPageComponent;
	let fixture: ComponentFixture<SpacesPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [SpacesPageComponent],
			imports: [IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(SpacesPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
