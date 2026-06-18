import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  ConsentDecision,
  ConsentDialogComponent,
} from './consent-dialog.component';
import { filterCatalogScopes } from './scope-catalog';

describe('ConsentDialogComponent', () => {
  let fixture: ComponentFixture<ConsentDialogComponent>;
  let component: ConsentDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsentDialogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsentDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('extensionName', 'Listus');
    fixture.componentRef.setInput('origin', 'https://listus.app');
    fixture.componentRef.setInput(
      'scopes',
      filterCatalogScopes([
        'profile:read',
        'contact_details:read',
        'contacts:read',
      ]),
    );
    fixture.detectChanges();
  });

  // AC: consent-shows-origin
  it('prominently displays the extension origin and name', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(
      el.querySelector('[data-test="consent-origin"]')?.textContent,
    ).toContain('https://listus.app');
    expect(el.textContent).toContain('Listus');
  });

  it('lists each requested scope with label and description', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Your profile');
    expect(text).toContain('Your contact details');
    expect(text).toContain('Your contacts');
  });

  it('grants nothing implicitly', () => {
    expect(component.grantedScopes()).toEqual([]);
  });

  // AC: granular-grant-and-decline
  it('emits exactly the granted scopes the user opted in, declining the rest', () => {
    let decision: ConsentDecision | undefined;
    component.decided.subscribe((d) => (decision = d));

    component.set('profile:read', true);
    component.set('contacts:read', true);
    // contact_details:read left un-granted
    component.confirm();

    const granted = decision?.decisions
      .filter((d) => d.granted)
      .map((d) => d.scope)
      .sort();
    const declined = decision?.decisions
      .filter((d) => !d.granted)
      .map((d) => d.scope);
    expect(granted).toEqual(['contacts:read', 'profile:read']);
    expect(declined).toEqual(['contact_details:read']);
  });

  it('declines every prompted scope on Decline all', () => {
    let decision: ConsentDecision | undefined;
    component.decided.subscribe((d) => (decision = d));
    component.set('profile:read', true);
    component.decline();
    expect(decision?.decisions.every((d) => !d.granted)).toBe(true);
  });

  it('toggling a scope off removes it from the pending selection', () => {
    component.set('profile:read', true);
    component.set('profile:read', false);
    expect(component.isGranted('profile:read')).toBe(false);
  });
});
