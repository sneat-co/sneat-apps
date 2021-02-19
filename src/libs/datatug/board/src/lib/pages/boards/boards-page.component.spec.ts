import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {BoardsPage} from './boards-page.component';

describe('DataboardsPage', () => {
	let component: BoardsPage;
	let fixture: ComponentFixture<BoardsPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [BoardsPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(BoardsPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
