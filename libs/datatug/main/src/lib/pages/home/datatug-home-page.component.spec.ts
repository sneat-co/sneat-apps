import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatatugHomePageComponent } from './datatug-home-page.component';

describe('HomePage', () => {
	let component: DatatugHomePageComponent;
	let fixture: ComponentFixture<DatatugHomePageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [DatatugHomePageComponent, IonicModule.forRoot()]}).compileComponents();

		fixture = TestBed.createComponent(DatatugHomePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
