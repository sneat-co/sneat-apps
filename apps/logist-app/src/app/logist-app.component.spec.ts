import { TestBed, waitForAsync } from '@angular/core/testing';
import { LogistAppComponent } from './logist-app.component';

describe('AppComponent', () => {
	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [LogistAppComponent],
		}).compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(LogistAppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});

	// it(`should have as title 'logist-app'`, () => {
	// 	const fixture = TestBed.createComponent(LogistAppComponent);
	// 	const app = fixture.componentInstance;
	// 	// expect(app.title).toEqual('logist-app');
	// });

	it('should render title', () => {
		const fixture = TestBed.createComponent(LogistAppComponent);
		fixture.detectChanges();
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector('h1')?.textContent).toContain(
			'Welcome logist-app',
		);
	});
});
