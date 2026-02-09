import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { ContactService } from '@sneat/contactus-services';

import { CommChannelFormComponent } from './comm-channel-form.component';

describe('CommChannelFormComponent', () => {
	let component: CommChannelFormComponent;
	let fixture: ComponentFixture<CommChannelFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [CommChannelFormComponent],
			providers: [
				{ provide: ClassName, useValue: 'CommChannelFormComponent' },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{
					provide: ContactService,
					useValue: { addContactCommChannel: vi.fn() },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(CommChannelFormComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CommChannelFormComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$contact', {
			id: 'test',
			space: { id: 'test-space' },
		});
		fixture.componentRef.setInput('$channelType', 'email');
		fixture.componentRef.setInput('$placeholder', 'email@address');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
