import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFamilyWizardComponent } from './new-family-wizard.component';

describe('NewFamilyWizardComponent', () => {
  let component: NewFamilyWizardComponent;
  let fixture: ComponentFixture<NewFamilyWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFamilyWizardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFamilyWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
