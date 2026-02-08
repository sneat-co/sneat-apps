import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PeriodSegmentComponent } from './period-segment.component';
import { provideAssetusMocks } from '../testing/test-utils';

describe('PeriodSegmentComponent', () => {
	let component: PeriodSegmentComponent;
	let fixture: ComponentFixture<PeriodSegmentComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [PeriodSegmentComponent],
			providers: [...provideAssetusMocks()],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PeriodSegmentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
