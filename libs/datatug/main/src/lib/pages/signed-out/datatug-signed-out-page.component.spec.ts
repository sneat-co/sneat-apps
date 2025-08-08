import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatatugSignedOutPageComponent } from './datatug-signed-out-page.component';

describe('SignedOutPage', () => {
	let component: DatatugSignedOutPageComponent;
	let fixture: ComponentFixture<DatatugSignedOutPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [DatatugSignedOutPageComponent],
			imports: [IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(DatatugSignedOutPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
