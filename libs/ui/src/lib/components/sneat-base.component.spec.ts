import { SneatBaseComponent } from './sneat-base.component';
import { IErrorLogger } from '@sneat/core';
import { Subject, Subscription } from 'rxjs';

class TestComponent extends SneatBaseComponent {
  constructor(errorLogger: IErrorLogger, className: string) {
    super();
    // @ts-expect-error accessing private property
    this.errorLogger = errorLogger;
    // @ts-expect-error accessing private property
    this.className = className;
    // @ts-expect-error accessing private property
    this.destroyed = new Subject<void>();
    // @ts-expect-error accessing private property
    this.subs = new Subscription();
  }

  public getDestroyed(): Subject<void> {
    // @ts-expect-error accessing private property
    return this.destroyed;
  }

  public getSubs(): Subscription {
    // @ts-expect-error accessing private property
    return this.subs;
  }

  public log(_msg: string) {
    void _msg;
    // override log to avoid console output
  }
}

describe('SneatBaseComponent', () => {
  let component: TestComponent;
  let errorLoggerMock: IErrorLogger;

  beforeEach(() => {
    errorLoggerMock = {
      logError: vi.fn(),
      logErrorHandler: vi.fn(),
    } as unknown as IErrorLogger;
    // Use Object.create to bypass constructor that calls inject()
    component = Object.create(TestComponent.prototype) as TestComponent;
    // @ts-expect-error accessing private property
    component.errorLogger = errorLoggerMock;
    // @ts-expect-error accessing private property
    component.className = 'TestComponent';
    // @ts-expect-error accessing private property
    component.destroyed = new Subject<void>();
    // @ts-expect-error accessing private property
    component.subs = new Subscription();

    // @ts-expect-error accessing private property
    vi.spyOn(component.destroyed, 'next');
    // @ts-expect-error accessing private property
    vi.spyOn(component.subs, 'unsubscribe');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on destroyed and unsubscribe when ngOnDestroy is called', () => {
    component.ngOnDestroy();
    // @ts-expect-error accessing private property
    expect(component.destroyed.next).toHaveBeenCalled();
    // @ts-expect-error accessing private property
    expect(component.subs.unsubscribe).toHaveBeenCalled();
  });
});
