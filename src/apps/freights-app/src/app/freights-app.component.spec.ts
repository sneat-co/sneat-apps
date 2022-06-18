import { TestBed } from '@angular/core/testing';
import { FreightsAppComponent } from './freights-app.component';
import { NxWelcomeComponent } from './nx-welcome.component';

describe('AppComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FreightsAppComponent, NxWelcomeComponent],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(FreightsAppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});

	it(`should have as title 'freights-app'`, () => {
		const fixture = TestBed.createComponent(FreightsAppComponent);
		const app = fixture.componentInstance;
		expect(app.title).toEqual('freights-app');
	});

	it('should render title', () => {
		const fixture = TestBed.createComponent(FreightsAppComponent);
		fixture.detectChanges();
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector('h1')?.textContent).toContain(
			'Welcome freights-app',
		);
	});
});
