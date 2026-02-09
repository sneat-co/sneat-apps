import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { HappeningSlotParticipantsComponent } from './happening-slot-participants.component';

describe('HappeningSlotParticipantsComponent', () => {
	let component: HappeningSlotParticipantsComponent;
	let fixture: ComponentFixture<HappeningSlotParticipantsComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [HappeningSlotParticipantsComponent],
			providers: [
				{ provide: ClassName, useValue: 'HappeningSlotParticipantsComponent' },
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{
					provide: ContactusSpaceService,
					useValue: {
						watchContactBriefs: vi.fn(() => ({
							pipe: () => ({ subscribe: vi.fn() }),
						})),
					},
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(HappeningSlotParticipantsComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
			})
			.compileComponents();
		fixture = TestBed.createComponent(HappeningSlotParticipantsComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$happeningSlot', {
			slot: { id: 'test-slot', repeats: 'once' },
			title: 'Test',
			repeats: 'once',
			happening: { id: 'test', space: { id: 'test-space' }, brief: {} },
		});
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
