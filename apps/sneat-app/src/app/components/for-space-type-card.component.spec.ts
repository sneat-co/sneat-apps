import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SneatUserService } from '@sneat/auth-core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';
import { ForSpaceTypeCardComponent } from './for-space-type-card.component';

describe('ForSpaceTypeCardComponent', () => {
	let component: ForSpaceTypeCardComponent;
	let fixture: ComponentFixture<ForSpaceTypeCardComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ForSpaceTypeCardComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: ClassName,
					useValue: 'ForSpaceTypeCardComponent',
				},
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{
					provide: SneatUserService,
					useValue: {
						userState: of({ record: undefined }),
					},
				},
			],
		})
			.overrideComponent(ForSpaceTypeCardComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();
		fixture = TestBed.createComponent(ForSpaceTypeCardComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
