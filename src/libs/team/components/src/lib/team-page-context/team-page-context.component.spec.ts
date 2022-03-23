import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPageContextComponent } from './team-page-context.component';

describe('TeamPageContextComponent', () => {
  let component: TeamPageContextComponent;
  let fixture: ComponentFixture<TeamPageContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamPageContextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPageContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
