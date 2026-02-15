import { TestBed } from '@angular/core/testing';
// import { describe, beforeEach, it, expect } from 'vitest';

import { NgModulePreloaderService } from './ng-module-preloader.service';

describe('NgModulePreloaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgModulePreloaderService = TestBed.inject(
      NgModulePreloaderService,
    );
    expect(service).toBeTruthy();
  });

  it('should add preload configs', () => {
    const service: NgModulePreloaderService = TestBed.inject(
      NgModulePreloaderService,
    );
    class MockModule {}
    service.addPreloadConfigs({
      id: 'test',
      path: 'path/to/test',
      type: MockModule,
    });
    // @ts-expect-error accessing private property for testing
    expect(service.configs['test']).toEqual({
      path: 'path/to/test',
      type: MockModule,
    });
  });

  it('should mark as preloaded', () => {
    const service: NgModulePreloaderService = TestBed.inject(
      NgModulePreloaderService,
    );
    service.markAsPreloaded('test-path');
    // @ts-expect-error accessing private property for testing
    expect(service.preloaded).toContain('test-path');
  });

  it('should warn when preload is called', () => {
    const service: NgModulePreloaderService = TestBed.inject(
      NgModulePreloaderService,
    );
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    service.preload(['path1']);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Preloading is disabled'),
    );
    warnSpy.mockRestore();
  });
});
