import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatugMenuComponent } from './datatug-menu.component';

describe('DatatugMenuComponent', () => {
  let component: DatatugMenuComponent;
  let fixture: ComponentFixture<DatatugMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatatugMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatugMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
