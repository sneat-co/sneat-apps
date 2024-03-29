import {
	animate,
	AnimationTriggerMetadata,
	style,
	transition,
	trigger,
} from '@angular/animations';

const removeListItemAnimation = transition('* => void', [
	animate(
		'0.2s ease-in-out',
		style({
			height: 0,
			opacity: 0,
		}),
	),
]);

const addListItemAnimation = transition('void => added', [
	style({
		height: 0,
		opacity: 0,
	}),
	animate(
		'0.5s ease-in',
		style({
			height: '*',
			opacity: 1,
		}),
	),
]);

// TODO: How it is different from listAddRemoveAnimation ?
export const listItemAnimations = trigger('listItem', [
	removeListItemAnimation,
	addListItemAnimation,
]);

// TODO: How it is different from listItemAnimations ?
export const listAddRemoveAnimation: AnimationTriggerMetadata[] = [
	trigger('addRemove', [
		transition(':leave', [animate('0.2s  ease-in-out', style({ height: 0 }))]),
	]),
];
