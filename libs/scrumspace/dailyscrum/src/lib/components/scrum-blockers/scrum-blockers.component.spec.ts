import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScrumBlockersComponent } from './scrum-blockers.component';

describe('ScrumBlockersComponent', () => {
	let component: ScrumBlockersComponent;
	let fixture: ComponentFixture<ScrumBlockersComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ScrumBlockersComponent],
				imports: [IonicModule.forRoot()],
			}).compileComponents();

			fixture = TestBed.createComponent(ScrumBlockersComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}),
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
