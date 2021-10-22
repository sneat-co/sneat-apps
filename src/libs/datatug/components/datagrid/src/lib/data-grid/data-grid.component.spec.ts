import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DataGridComponent } from './data-grid.component';

describe('DataGridComponent', () => {
	let component: DataGridComponent;
	let fixture: ComponentFixture<DataGridComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [DataGridComponent],
				imports: [IonicModule.forRoot()],
			}).compileComponents();

			fixture = TestBed.createComponent(DataGridComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
