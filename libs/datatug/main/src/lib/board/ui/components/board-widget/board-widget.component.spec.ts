import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoardWidgetComponent } from './board-widget.component';

describe('BoardWidgetComponent', () => {
	let component: BoardWidgetComponent;
	let fixture: ComponentFixture<BoardWidgetComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [BoardWidgetComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(BoardWidgetComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(BoardWidgetComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
