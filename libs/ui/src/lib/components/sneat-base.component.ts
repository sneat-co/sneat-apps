import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { createSetFocusToInput } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { Subject, Subscription } from 'rxjs';

@Injectable()
export abstract class SneatBaseComponent implements OnDestroy {

  protected readonly destroyed = new Subject<void>();
  protected readonly subs = new Subscription();

  protected constructor(
    @Inject(new InjectionToken('className')) public readonly className: string,
    @Inject(ErrorLogger) protected readonly errorLogger: IErrorLogger,
  ) {
  }

  protected readonly setFocusToInput = createSetFocusToInput(this.errorLogger);

  public ngOnDestroy(): void {
    this.unsubscribe(`${this.className}.ngOnDestroy()`);
    this.destroyed.next();
    this.destroyed.complete();
  }

  protected unsubscribe(reason?: string): void {
    console.log(`${this.className}.unsubscribe(reason: ${reason})`);
    this.subs.unsubscribe();
  }

}
