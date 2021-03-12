import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContextMenuComponent } from './project-context-menu.component';

describe('ProjectContextMenuComponent', () => {
  let component: ProjectContextMenuComponent;
  let fixture: ComponentFixture<ProjectContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectContextMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
