import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackerComponent } from './tracker.component';

describe('TrackerComponent', () => {
	let component: TrackerComponent;
	let fixture: ComponentFixture<TrackerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TrackerComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TrackerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
