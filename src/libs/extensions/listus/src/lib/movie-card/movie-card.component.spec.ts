import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MovieCardComponent} from './movie-card.component';

describe('MovieCardComponent', () => {
	let component: MovieCardComponent;
	let fixture: ComponentFixture<MovieCardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MovieCardComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MovieCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
