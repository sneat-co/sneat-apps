import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[sneatSelectAllOnFocus]',
})
export class SneatSelectAllOnFocusDirective {
  private readonly el = inject(ElementRef);

  @HostListener('focus', ['$event.target'])
  public selectAll(target?: EventTarget | null) {
    const nativeElement = this.el.nativeElement;
    const input =
      nativeElement instanceof HTMLInputElement ||
      nativeElement instanceof HTMLTextAreaElement
        ? nativeElement
        : nativeElement.querySelector('input') ||
          nativeElement.querySelector('textarea');

    if (input) {
      if ('setSelectionRange' in input) {
        try {
          input.setSelectionRange(0, (input as HTMLInputElement).value.length);
          return;
        } catch {
          console.warn('Element does not support setSelectionRange');
        }
      }
      if (
        input instanceof HTMLInputElement ||
        input instanceof HTMLTextAreaElement
      ) {
        input.select();
      }
    }
  }
}
