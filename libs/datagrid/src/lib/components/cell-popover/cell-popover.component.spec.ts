import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CellPopoverComponent } from './cell-popover.component';

describe('CellPopoverComponent', () => {
	let component: CellPopoverComponent;
	let fixture: ComponentFixture<CellPopoverComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [CellPopoverComponent, IonicModule.forRoot()]}).compileComponents();

		fixture = TestBed.createComponent(CellPopoverComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
