import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {DatatugMyPage} from './datatug-my-page.component';

describe('MyPage', () => {
	let component: DatatugMyPage;
	let fixture: ComponentFixture<DatatugMyPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [DatatugMyPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(DatatugMyPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
