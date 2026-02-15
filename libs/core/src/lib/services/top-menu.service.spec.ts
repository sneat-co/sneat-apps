import { TestBed } from '@angular/core/testing';

import { TopMenuService } from './top-menu.service';

describe('TopMenuService', () => {
  let service: TopMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update visibility when visibilityChanged is called', () => {
    const mockEvent = {
      detail: { visible: true },
    } as unknown as CustomEvent;

    let isVisible: boolean | undefined;
    let isHidden: boolean | undefined;

    service.isTopMenuVisible.subscribe((v) => (isVisible = v));
    service.isTopMenuHidden.subscribe((v) => (isHidden = v));

    service.visibilityChanged(mockEvent);

    expect(isVisible).toBe(true);
    expect(isHidden).toBe(false);

    const mockEventHidden = {
      detail: { visible: false },
    } as unknown as CustomEvent;

    service.visibilityChanged(mockEventHidden);

    expect(isVisible).toBe(false);
    expect(isHidden).toBe(true);
  });
});
