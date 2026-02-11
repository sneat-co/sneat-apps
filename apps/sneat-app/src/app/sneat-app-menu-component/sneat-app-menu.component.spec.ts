import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { SneatAuthStateService } from '@sneat/auth-core';

import { SneatAppMenuComponent } from './sneat-app-menu.component';

describe('SneatAppMenuComponent', () => {
  let component: SneatAppMenuComponent;
  let fixture: ComponentFixture<SneatAppMenuComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [SneatAppMenuComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: SneatAuthStateService,
          useValue: { authState: of({ status: 'notAuthenticated' }) },
        },
      ],
    })
      .overrideComponent(SneatAppMenuComponent, {
        set: { imports: [], template: '', schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SneatAppMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
