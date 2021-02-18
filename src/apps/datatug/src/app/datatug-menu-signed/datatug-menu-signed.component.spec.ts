import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {DatatugMenuSignedComponent} from './datatug-menu-signed.component';

describe('DatatugMenuComponent', () => {
	let component: DatatugMenuSignedComponent;
	let fixture: ComponentFixture<DatatugMenuSignedComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [DatatugMenuSignedComponent],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(DatatugMenuSignedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
