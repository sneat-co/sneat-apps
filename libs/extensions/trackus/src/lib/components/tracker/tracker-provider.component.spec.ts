import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { EMPTY } from 'rxjs';
import { TrackersService } from '../../trackers-service';
import { TrackerProviderComponent } from './tracker-provider.component';

describe('TrackerProviderComponent', () => {
	let component: TrackerProviderComponent;
	let fixture: ComponentFixture<TrackerProviderComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [TrackerProviderComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: ClassName, useValue: 'TrackerProviderComponent' },
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{
					provide: TrackersService,
					useValue: { watchModuleSpaceItem: () => EMPTY },
				},
			],
		})
			.overrideComponent(TrackerProviderComponent, {
				set: {
					imports: [],
					providers: [],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(TrackerProviderComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$spaceID', undefined);
		fixture.componentRef.setInput('$trackerID', undefined);
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
