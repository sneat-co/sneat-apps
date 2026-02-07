import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BoardRowComponent } from './board-row.component';

describe('BoardRowComponent', () => {
	let component: BoardRowComponent;
	let fixture: ComponentFixture<BoardRowComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			,
			imports: [BoardRowComponent, IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(BoardRowComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
