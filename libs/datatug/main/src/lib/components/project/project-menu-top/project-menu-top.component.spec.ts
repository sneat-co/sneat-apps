import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectMenuTopComponent } from './project-menu-top.component';

describe('ProjectContextMenuComponent', () => {
	let component: ProjectMenuTopComponent;
	let fixture: ComponentFixture<ProjectMenuTopComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [ProjectMenuTopComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ProjectMenuTopComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
