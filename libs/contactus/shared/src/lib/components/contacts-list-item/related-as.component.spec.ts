import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RelatedAsComponent } from './related-as.component';

describe('RelatedAsComponent', () => {
  let component: RelatedAsComponent;
  let fixture: ComponentFixture<RelatedAsComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedAsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(RelatedAsComponent, {
        set: { imports: [], template: '' },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedAsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$spaceRef', { id: 'test-space' });
    fixture.componentRef.setInput('$itemID', 'test-item');
    fixture.componentRef.setInput('$moduleID', 'contactus');
    fixture.componentRef.setInput('$collectionID', 'contacts');
    fixture.componentRef.setInput('$relatedTo', { title: 'Test', related: {} });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
