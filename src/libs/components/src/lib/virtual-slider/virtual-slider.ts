import {animate, animateChild, AnimationTriggerMetadata, group, query, state, style, transition, trigger} from '@angular/animations';

const defaultTiming = '250ms ease-out';

const defaultActiveOpacity = '1';
const defaultHiddenOpacity = '0.05';

interface IVirtualSliderOptions {
	timing: string;
	activeOpacity?: string;
	hiddenOpacity?: string;
}

type VirtualSlideStateShow = 'show';
type VirtualSlideStateHide = 'hide';

export const showVirtualSlide: VirtualSlideStateShow = 'show';
export const hideVirtualSlide: VirtualSlideStateHide = 'hide';

export type VirtualSlideAnimationsStates = VirtualSlideStateShow | VirtualSlideStateHide;

export const VirtualSliderDirectPushedNext = 'direct-push-next';
export const VirtualSliderDirectPushedPrev = 'direct-push-prev';
export const VirtualSliderReversePushedNext = 'reverse-push-next';
export const VirtualSliderReversePushedPrev = 'reverse-push-prev';

export type VirtualSliderAnimationStates =
	'direct-push-next' |
	'direct-push-prev' |
	'reverse-push-next' |
	'reverse-push-prev';

const options: IVirtualSliderOptions = {
	timing: defaultTiming,
	activeOpacity: defaultActiveOpacity,
	hiddenOpacity: defaultHiddenOpacity,
};

const slideLeft = group([
	animate(options.timing, style({transform: 'translateX(-50%)'})),
	query('@virtualSlide', animateChild()),
]);
const slideRight = group([
	animate(options.timing, style({transform: 'translateX(0)'})),
	query('@virtualSlide', animateChild()),
]);

export const virtualSliderAnimations: AnimationTriggerMetadata[] = [
	trigger('virtualSlide', [
		transition('void => *', animate(0)),
// tslint:disable-next-line:ban-ts-ignore
// @ts-ignore
		state(showVirtualSlide, style({opacity: options.activeOpacity})),
// tslint:disable-next-line:ban-ts-ignore
// @ts-ignore
		state(hideVirtualSlide, style({opacity: options.hiddenOpacity})),
		transition('* => *', animate(options.timing)),
	]),
	trigger('virtualSlider', [
		transition('void => *', animate(0)),
		// Slides: A→B
		state(VirtualSliderDirectPushedNext, style({
			flexDirection: 'row',
			transform: 'translateX(-50%)',
		})),
		transition(`* => ${VirtualSliderDirectPushedNext}`, [
			style({
				flexDirection: 'row',
				transform: 'translateX(0)',
			}),
			slideLeft,
		]),
		// Slides: A←B
		state(VirtualSliderDirectPushedPrev, style({
			flexDirection: 'row',
			transform: 'translateX(0)',
		})),
		transition(`* => ${VirtualSliderDirectPushedPrev}`, [
			style({
				flexDirection: 'row',
				transform: 'translateX(-50%)',
			}),
			slideRight,
		]),
		// Slides: B→A
		state(VirtualSliderReversePushedNext, style({
			flexDirection: 'row-reverse',
			transform: 'translateX(-50%)',
		})),
		transition(`* => ${VirtualSliderReversePushedNext}`, [
			style({
				flexDirection: 'row-reverse',
				transform: 'translateX(0)',
			}),
			slideLeft,
		]),
		// Slides: B←A
		state(VirtualSliderReversePushedPrev, style({
			flexDirection: 'row-reverse',
			transform: 'translateX(0)',
		})),
		transition(`* => ${VirtualSliderReversePushedPrev}`, [
			style({
				flexDirection: 'row-reverse',
				transform: 'translateX(-50%)',
			}),
			slideRight,
		]),
	]),
];

