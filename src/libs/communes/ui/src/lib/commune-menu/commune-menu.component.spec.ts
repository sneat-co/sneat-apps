import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommuneMenuComponent } from './commune-menu.component';

describe('CommuneMenuComponent', () => {
  let component: CommuneMenuComponent;
  let fixture: ComponentFixture<CommuneMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommuneMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommuneMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
