import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {StorePageComponent} from './store-page.component';

describe('StorePageComponent', () => {
	let component: StorePageComponent;
	let fixture: ComponentFixture<StorePageComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [StorePageComponent],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(StorePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
