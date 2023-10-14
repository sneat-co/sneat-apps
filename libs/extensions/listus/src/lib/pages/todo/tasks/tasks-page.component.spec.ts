import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksPageComponent } from './tasks-page.component';

describe('TasksPage', () => {
	let component: TasksPageComponent;
	let fixture: ComponentFixture<TasksPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TasksPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TasksPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
