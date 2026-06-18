import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ExtensionHostComponent } from './extension-host.component';
import { FrameSrcAllowlistService } from './frame-src-allowlist.service';
import { ExtensionMenuItem, ExtensionRegistration } from './models';

const ORIGIN = 'https://listus.app';

const REGISTRATION: ExtensionRegistration = {
  id: 'listus.app',
  origin: ORIGIN,
  url: ORIGIN,
  manifest: {
    name: 'Listus',
    author: { name: 'Jane', email: 'jane@listus.app' },
    icon: 'https://listus.app/icon.png',
    scopes: ['lists:read'],
    origin: ORIGIN,
  },
  scopes: ['lists:read'],
};

function iframe(
  fixture: ComponentFixture<ExtensionHostComponent>,
): HTMLIFrameElement | null {
  return fixture.nativeElement.querySelector('iframe');
}

describe('ExtensionHostComponent', () => {
  let fixture: ComponentFixture<ExtensionHostComponent>;
  let allowlist: FrameSrcAllowlistService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtensionHostComponent],
    }).compileComponents();
    allowlist = TestBed.inject(FrameSrcAllowlistService);
    document.getElementById('sneat-ext-frame-src-csp')?.remove();
    fixture = TestBed.createComponent(ExtensionHostComponent);
  });

  it('does not render an iframe for an origin absent from the allowlist', () => {
    fixture.componentRef.setInput('registration', REGISTRATION);
    fixture.detectChanges();
    expect(iframe(fixture)).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.sneat-ext-blocked'),
    ).toBeTruthy();
  });

  it('renders a single sandboxed iframe at the extension origin when allowlisted', () => {
    allowlist.add(ORIGIN);
    fixture.componentRef.setInput('registration', REGISTRATION);
    fixture.detectChanges();

    const frames = fixture.nativeElement.querySelectorAll('iframe');
    expect(frames).toHaveLength(1);
    expect(frames[0].getAttribute('sandbox')).toBe(
      'allow-scripts allow-same-origin',
    );
    expect(frames[0].getAttribute('src')).toBe('https://listus.app/');
  });

  it('renders well-formed menu items and ignores malformed ones', () => {
    allowlist.add(ORIGIN);
    fixture.componentRef.setInput('registration', REGISTRATION);
    fixture.componentRef.setInput('menuItems', [
      { title: 'Lists', emoji: '📋', path: '/lists' },
      { title: 'Tasks', path: '/tasks' },
    ] as ExtensionMenuItem[]);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      '.sneat-ext-menu-item',
    );
    expect(buttons).toHaveLength(2);
    expect(buttons[0].textContent).toContain('Lists');
  });

  it('re-routes the SINGLE existing iframe on activation, never spawning a second', () => {
    allowlist.add(ORIGIN);
    fixture.componentRef.setInput('registration', REGISTRATION);
    fixture.componentRef.setInput('menuItems', [
      { title: 'Tasks', path: '/tasks', args: { open: true } },
    ] as ExtensionMenuItem[]);
    fixture.detectChanges();

    fixture.componentInstance.activate({
      title: 'Tasks',
      path: '/tasks',
      args: { open: true },
    });
    fixture.detectChanges();

    const frames = fixture.nativeElement.querySelectorAll('iframe');
    expect(frames).toHaveLength(1);
    expect(frames[0].getAttribute('src')).toContain('https://listus.app/tasks');
    expect(frames[0].getAttribute('src')).toContain('open=true');
  });
});
