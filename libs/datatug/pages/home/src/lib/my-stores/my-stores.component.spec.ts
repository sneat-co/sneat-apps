import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyStoresComponent } from './my-stores.component';

describe('MyStoresComponent', () => {
	let component: MyStoresComponent;
	let fixture: ComponentFixture<MyStoresComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MyStoresComponent],
			imports: [IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(MyStoresComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
