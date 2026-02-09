import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ContactCommChannelsComponent } from './contact-comm-channels.component';

describe('ContactCommChannelsComponent', () => {
	let component: ContactCommChannelsComponent;
	let fixture: ComponentFixture<ContactCommChannelsComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ContactCommChannelsComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(ContactCommChannelsComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactCommChannelsComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$contact', {
			id: 'test',
			space: { id: 'test-space' },
		});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
