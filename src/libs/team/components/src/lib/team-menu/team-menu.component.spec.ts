import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMenuComponent } from './team-menu.component';

describe('TeamMenuComponent', () => {
  let component: TeamMenuComponent;
  let fixture: ComponentFixture<TeamMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
