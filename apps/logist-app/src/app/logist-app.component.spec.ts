import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { TopMenuService } from '@sneat/core';

import { LogistAppComponent } from './logist-app.component';

describe('AppComponent', () => {
	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [LogistAppComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: TopMenuService, useValue: { visibilityChanged: vi.fn() } },
			],
		})
			.overrideComponent(LogistAppComponent, {
				set: { imports: [], template: '', schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(LogistAppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
