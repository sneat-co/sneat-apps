import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { FrameSrcAllowlistService } from './frame-src-allowlist.service';

describe('FrameSrcAllowlistService', () => {
  let service: FrameSrcAllowlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrameSrcAllowlistService);
    document.getElementById('sneat-ext-frame-src-csp')?.remove();
  });

  it('blocks an origin that was never added', () => {
    expect(service.isAllowed('https://listus.app')).toBe(false);
    expect(service.frameSrcDirective()).toBe("frame-src 'none'");
  });

  it('allows an origin once added and reflects it into the CSP meta tag', () => {
    service.add('https://listus.app');
    expect(service.isAllowed('https://listus.app')).toBe(true);

    const meta = document.getElementById(
      'sneat-ext-frame-src-csp',
    ) as HTMLMetaElement;
    expect(meta).toBeTruthy();
    expect(meta.httpEquiv).toBe('Content-Security-Policy');
    expect(meta.getAttribute('content')).toContain('https://listus.app');
    expect(meta.getAttribute('content')).toContain("frame-src 'none'");
  });

  it('refuses to add a non-https origin', () => {
    expect(service.add('http://listus.app')).toBeUndefined();
    expect(service.isAllowed('http://listus.app')).toBe(false);
    expect(service.list()).toEqual([]);
  });

  it('removes an origin so it is blocked again and dropped from the CSP', () => {
    service.add('https://listus.app');
    service.add('https://other.app');
    expect(service.remove('https://listus.app')).toBe(true);

    expect(service.isAllowed('https://listus.app')).toBe(false);
    expect(service.isAllowed('https://other.app')).toBe(true);

    const content = document
      .getElementById('sneat-ext-frame-src-csp')
      ?.getAttribute('content');
    expect(content).not.toContain('https://listus.app');
    expect(content).toContain('https://other.app');
  });

  it('reports false when removing an origin that was never added', () => {
    expect(service.remove('https://nope.app')).toBe(false);
  });
});
