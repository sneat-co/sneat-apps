import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { NewListDialogComponent } from './new-list-dialog.component';

describe('NewListDialogComponent', () => {
	let component: NewListDialogComponent;
	let fixture: ComponentFixture<NewListDialogComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [NewListDialogComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{
					provide: ModalController,
					useValue: { create: vi.fn(), dismiss: vi.fn() },
				},
			],
		})
			.overrideComponent(NewListDialogComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(NewListDialogComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
