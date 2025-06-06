import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
	selector: '[sneatSelectAllOnFocus]',
})
export class SneatSelectAllOnFocusDirective {
	private readonly el = inject(ElementRef);

	@HostListener('focus') // TODO: Fix - for some reason does not get focus events
	public selectAll() {
		console.log('SneatSelectAllOnFocusDirective.selectAll()');
		const input = this.el.nativeElement.querySelector('input');
		if (input) {
			if (input.setSelectionRange) {
				try {
					return input.setSelectionRange(0, input.value.length); // select the text from start to end
				} catch {
					console.warn('Number elements does not support setSelectionRange');
				}
			}
			input.select();
		}
	}
}
