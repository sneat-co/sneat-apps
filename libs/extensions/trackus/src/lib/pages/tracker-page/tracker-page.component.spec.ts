import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackerPageComponent } from './tracker-page.component';

describe('TrackerPageComponent', () => {
	let component: TrackerPageComponent;
	let fixture: ComponentFixture<TrackerPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TrackerPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TrackerPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
