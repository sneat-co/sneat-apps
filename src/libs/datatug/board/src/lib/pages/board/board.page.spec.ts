import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {BoardPage} from './board.page';

describe('BoardPage', () => {
	let component: BoardPage;
	let fixture: ComponentFixture<BoardPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [BoardPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(BoardPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
