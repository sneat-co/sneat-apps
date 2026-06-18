import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ConsentStore } from './consent-store.service';
import { ExtensionRegistry } from './extension-registry.service';
import { FrameSrcAllowlistService } from './frame-src-allowlist.service';
import { IS_TRUSTED_ORIGIN, IsTrustedOrigin } from './is-trusted-origin';
import { ExtensionRegistration } from './models';
import { PermissionManagementComponent } from './permission-management.component';
import { isTrustedOrigin } from './trusted-origin-allowlist';

const USER = 'user-1';

function registrationOf(
  host: string,
  name: string,
  scopes: readonly string[] = [],
): ExtensionRegistration {
  const origin = `https://${host}`;
  return {
    id: host,
    origin,
    url: `${origin}/`,
    manifest: {
      name,
      author: { name: 'Author', email: 'a@example.com' },
      icon: `${origin}/icon.png`,
      scopes,
      origin,
    },
    scopes,
  };
}

function setup(isTrusted: IsTrustedOrigin = () => false): {
  fixture: ComponentFixture<PermissionManagementComponent>;
  registry: ExtensionRegistry;
  consent: ConsentStore;
  allowlist: FrameSrcAllowlistService;
} {
  TestBed.configureTestingModule({
    imports: [PermissionManagementComponent],
    providers: [{ provide: IS_TRUSTED_ORIGIN, useValue: isTrusted }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  const registry = TestBed.inject(ExtensionRegistry);
  const consent = TestBed.inject(ConsentStore);
  const allowlist = TestBed.inject(FrameSrcAllowlistService);
  const fixture = TestBed.createComponent(PermissionManagementComponent);
  return { fixture, registry, consent, allowlist };
}

function render(
  fixture: ComponentFixture<PermissionManagementComponent>,
): HTMLElement {
  fixture.componentRef.setInput('userId', USER);
  fixture.detectChanges();
  return fixture.nativeElement;
}

describe('PermissionManagementComponent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  // AC: list-shows-installed-extensions
  it('lists each installed extension with name, icon, and origin', () => {
    const { fixture, registry } = setup();
    registry.create(registrationOf('a.app', 'Alpha'));
    registry.create(registrationOf('b.app', 'Beta'));

    const el = render(fixture);

    const names = [...el.querySelectorAll('[data-test="ext-name"]')].map((n) =>
      n.textContent?.trim(),
    );
    expect(names).toEqual(['Alpha', 'Beta']);
    const origins = [...el.querySelectorAll('[data-test="ext-origin"]')].map(
      (n) => n.textContent?.trim(),
    );
    expect(origins).toEqual(['https://a.app', 'https://b.app']);
    const icons = [...el.querySelectorAll('[data-test="ext-icon"]')].map((n) =>
      n.getAttribute('src'),
    );
    expect(icons).toEqual(['https://a.app/icon.png', 'https://b.app/icon.png']);
  });

  // AC: empty-state-when-none-installed
  it('shows a non-error empty state when nothing is installed', () => {
    const { fixture } = setup();
    const el = render(fixture);
    expect(el.querySelector('[data-test="empty-state"]')).not.toBeNull();
    expect(el.querySelector('[data-test="ext-name"]')).toBeNull();
  });

  // AC: shows-currently-granted-scopes
  it('renders only currently-granted scopes by label for an untrusted extension', () => {
    const { fixture, registry, consent } = setup();
    registry.create(registrationOf('a.app', 'Alpha'));
    consent.recordGrant(USER, 'a.app', 'profile:read');
    consent.recordGrant(USER, 'a.app', 'contacts:read');

    const el = render(fixture);
    const text =
      el.querySelector('[data-test="scope-list"]')?.textContent ?? '';
    expect(text).toContain('Your profile');
    expect(text).toContain('Your contacts');
    expect(text).not.toContain("Your contacts' contact details");
    expect(el.querySelector('[data-test="trusted-badge"]')).toBeNull();
  });

  // AC: trusted-extension-shows-full-access-badge (trusted branch)
  it('shows the trusted full-access badge and Remove, but no scope list, when trusted', () => {
    const { fixture, registry, consent } = setup(
      (origin) => origin === 'https://trusted.app',
    );
    registry.create(registrationOf('trusted.app', 'Trusted'));
    consent.recordGrant(USER, 'trusted.app', 'profile:read');

    const el = render(fixture);
    expect(
      el.querySelector('[data-test="trusted-badge"]')?.textContent,
    ).toContain('Trusted — full account access');
    expect(el.querySelector('[data-test="scope-list"]')).toBeNull();
    expect(el.querySelector('[data-test="remove"]')).not.toBeNull();
  });

  // AC: trusted-extension-shows-full-access-badge (untrusted branch)
  it('shows the per-scope list and not the badge when untrusted', () => {
    const { fixture, registry, consent } = setup(() => false);
    registry.create(registrationOf('a.app', 'Alpha'));
    consent.recordGrant(USER, 'a.app', 'profile:read');

    const el = render(fixture);
    expect(el.querySelector('[data-test="trusted-badge"]')).toBeNull();
    expect(el.querySelector('[data-test="scope-list"]')).not.toBeNull();
  });

  // AC: trusted-extension-shows-full-access-badge (real allowlist predicate)
  it('lights the full-access badge for a real trusted-allowlist origin via the real predicate', () => {
    const { fixture, registry, consent } = setup(isTrustedOrigin);
    registry.create(registrationOf('listus.app', 'Listus'));
    registry.create(registrationOf('acme.example', 'Acme'));
    consent.recordGrant(USER, 'acme.example', 'profile:read');

    const el = render(fixture);

    const trusted = el.querySelector('[data-test-ext="listus.app"]');
    const untrusted = el.querySelector('[data-test-ext="acme.example"]');
    expect(
      trusted?.querySelector('[data-test="trusted-badge"]')?.textContent,
    ).toContain('Trusted — full account access');
    expect(trusted?.querySelector('[data-test="scope-list"]')).toBeNull();
    expect(untrusted?.querySelector('[data-test="trusted-badge"]')).toBeNull();
    expect(untrusted?.querySelector('[data-test="scope-list"]')).not.toBeNull();
  });

  // AC: revoke-single-scope
  it('revoking a scope removes it from the rendered list immediately', () => {
    const { fixture, registry, consent } = setup();
    registry.create(registrationOf('a.app', 'Alpha'));
    consent.recordGrant(USER, 'a.app', 'contacts:read');

    const el = render(fixture);
    expect(
      el.querySelector('[data-test-scope="contacts:read"]'),
    ).not.toBeNull();

    el.querySelector<HTMLButtonElement>('[data-test="revoke"]')?.click();
    fixture.detectChanges();

    expect(el.querySelector('[data-test-scope="contacts:read"]')).toBeNull();
    expect(consent.isGranted(USER, 'a.app', 'contacts:read')).toBe(false);
  });

  // AC: remove-extension-fully
  it('removing an extension clears registration + allowlist and drops it from the list', () => {
    const { fixture, registry, consent, allowlist } = setup();
    registry.create(registrationOf('a.app', 'Alpha'));
    allowlist.add('https://a.app');
    consent.recordGrant(USER, 'a.app', 'profile:read');

    const el = render(fixture);
    el.querySelector<HTMLButtonElement>('[data-test="remove"]')?.click();
    fixture.detectChanges();

    expect(el.querySelector('[data-test-ext="a.app"]')).toBeNull();
    expect(registry.has('a.app')).toBe(false);
    expect(allowlist.isAllowed('https://a.app')).toBe(false);
    expect(consent.listGranted(USER, 'a.app')).toEqual([]);
  });
});
