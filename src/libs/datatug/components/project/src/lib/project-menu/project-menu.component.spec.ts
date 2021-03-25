import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMenuComponent } from './project-menu.component';

describe('ProjectContextMenuComponent', () => {
  let component: ProjectMenuComponent;
  let fixture: ComponentFixture<ProjectMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
