import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SneatCardListComponent } from './sneat-card-list.component';

describe('CardListComponent', () => {
	let component: SneatCardListComponent;
	let fixture: ComponentFixture<SneatCardListComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [SneatCardListComponent],
				imports: [IonicModule.forRoot()],
			}).compileComponents();

			fixture = TestBed.createComponent(SneatCardListComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}),
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
