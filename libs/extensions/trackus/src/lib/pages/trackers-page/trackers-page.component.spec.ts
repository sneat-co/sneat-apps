import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackersPageComponent } from './trackers-page.component';

describe('TrackusPageComponent', () => {
	let component: TrackersPageComponent;
	let fixture: ComponentFixture<TrackersPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TrackersPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TrackersPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
