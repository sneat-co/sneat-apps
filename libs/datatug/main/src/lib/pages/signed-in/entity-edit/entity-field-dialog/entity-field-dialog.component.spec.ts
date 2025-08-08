import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EntityFieldDialogComponent } from './entity-field-dialog.component';

describe('EntityFieldDialogComponent', () => {
	let component: EntityFieldDialogComponent;
	let fixture: ComponentFixture<EntityFieldDialogComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [EntityFieldDialogComponent],
			imports: [IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(EntityFieldDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
