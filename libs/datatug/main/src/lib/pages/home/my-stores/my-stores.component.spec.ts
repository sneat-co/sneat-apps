import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyStoresComponent } from './my-stores.component';

describe('MyStoresComponent', () => {
	let component: MyStoresComponent;
	let fixture: ComponentFixture<MyStoresComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MyStoresComponent, IonicModule.forRoot()]}).compileComponents();

		fixture = TestBed.createComponent(MyStoresComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
