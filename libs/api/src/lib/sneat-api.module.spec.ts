import { TestBed } from '@angular/core/testing';
import { SneatApiModule } from './sneat-api.module';

describe('SneatApiModule', () => {
  it('should create module', () => {
    const module = new SneatApiModule();
    expect(module).toBeTruthy();
  });

  it('should be importable in TestBed', () => {
    TestBed.configureTestingModule({
      imports: [SneatApiModule],
    });

    const module = TestBed.inject(SneatApiModule);
    expect(module).toBeTruthy();
  });
});
