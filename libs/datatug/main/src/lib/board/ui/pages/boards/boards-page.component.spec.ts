import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BoardsPageComponent } from './boards-page.component';

describe('DataboardsPage', () => {
	let component: BoardsPageComponent;
	let fixture: ComponentFixture<BoardsPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [BoardsPageComponent, IonicModule.forRoot()]}).compileComponents();

		fixture = TestBed.createComponent(BoardsPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
