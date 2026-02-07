import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatatugMyPageComponent } from './datatug-my-page.component';

describe('MyPage', () => {
	let component: DatatugMyPageComponent;
	let fixture: ComponentFixture<DatatugMyPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [DatatugMyPageComponent, IonicModule.forRoot()]}).compileComponents();

		fixture = TestBed.createComponent(DatatugMyPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
