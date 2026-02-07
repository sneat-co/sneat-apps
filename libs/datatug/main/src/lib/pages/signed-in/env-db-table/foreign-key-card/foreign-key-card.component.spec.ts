import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForeignKeyCardComponent } from './foreign-key-card.component';

describe('ForeignKeyCardComponent', () => {
	let component: ForeignKeyCardComponent;
	let fixture: ComponentFixture<ForeignKeyCardComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			,
			imports: [ForeignKeyCardComponent, IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(ForeignKeyCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
