import { Injectable } from '@angular/core';
import { SpaceBaseComponent } from './space-base-component.directive';

@Injectable() // we need this decorator so we can implement Angular interfaces
export abstract class SpacePageBaseComponent extends SpaceBaseComponent {
	protected constructor(
		// we need this fake token so we can implement Angular interfaces
		className: string,
	) {
		super(className);
	}
}
