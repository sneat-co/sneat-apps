import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetroItemCardComponent } from './retro-item-card.component';

describe('RetroItemCardComponent', () => {
	let component: RetroItemCardComponent;
	let fixture: ComponentFixture<RetroItemCardComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [RetroItemCardComponent],
				imports: [IonicModule.forRoot()],
			}).compileComponents();

			fixture = TestBed.createComponent(RetroItemCardComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}),
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
