import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatatugMyPageComponent } from './datatug-my-page.component';

describe('MyPage', () => {
	let component: DatatugMyPageComponent;
	let fixture: ComponentFixture<DatatugMyPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [DatatugMyPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(DatatugMyPageComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(DatatugMyPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
