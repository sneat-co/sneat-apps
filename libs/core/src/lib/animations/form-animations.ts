import { animate, style, transition, trigger } from '@angular/animations';

export const formNexInAnimation = trigger('formNextIn', [
	transition(':enter', [
		style({ opacity: 0 }), // initial styles
		animate(
			'250ms',
			style({ opacity: 1 }), // final style after the transition has finished
		),
	]),
]);
