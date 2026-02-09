import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SpaceNavService } from '@sneat/space-services';

import { MembersCardHeaderComponent } from './members-card-header.component';

describe('MembersCardHeaderComponent', () => {
	let component: MembersCardHeaderComponent;
	let fixture: ComponentFixture<MembersCardHeaderComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MembersCardHeaderComponent],
			providers: [
				{
					provide: SpaceNavService,
					useValue: { navigateForwardToSpacePage: vi.fn() },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(MembersCardHeaderComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MembersCardHeaderComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.componentRef.setInput('$contactusSpace', {
			id: 'test-space',
			dbo: null,
		});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
