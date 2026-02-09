import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { ContactService } from '@sneat/contactus-services';

import { CommChannelItemComponent } from './comm-channel-item.component';

describe('CommChannelItemComponent', () => {
	let component: CommChannelItemComponent;
	let fixture: ComponentFixture<CommChannelItemComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [CommChannelItemComponent],
			providers: [
				{ provide: ClassName, useValue: 'CommChannelItemComponent' },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{
					provide: ContactService,
					useValue: {
						deleteContactCommChannel: vi.fn(),
						updateContactCommChannel: vi.fn(),
					},
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(CommChannelItemComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CommChannelItemComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$channelType', 'email');
		fixture.componentRef.setInput('$channel', { id: 'test@test.com' });
		fixture.componentRef.setInput('$contactID', 'test-contact');
		fixture.componentRef.setInput('$spaceID', 'test-space');
		fixture.componentRef.setInput('$lines', 'full');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
