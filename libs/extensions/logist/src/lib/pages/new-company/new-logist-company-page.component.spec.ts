import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CONTACT_ROLES_BY_TYPE } from '@sneat/app';
import { provideLogistMocks } from '../../testing/test-utils';
import { NewLogistCompanyPageComponent } from './new-logist-company-page.component';

describe('NewLogistCompanyPageComponent', () => {
  let component: NewLogistCompanyPageComponent;
  let fixture: ComponentFixture<NewLogistCompanyPageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLogistCompanyPageComponent],
      providers: [
        ...provideLogistMocks(),
        {
          provide: CONTACT_ROLES_BY_TYPE,
          useValue: { company: [] },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(NewLogistCompanyPageComponent, {
        set: {
          imports: [],
          providers: [],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NewLogistCompanyPageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
