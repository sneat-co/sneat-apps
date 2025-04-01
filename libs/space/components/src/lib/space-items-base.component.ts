import { SpaceBaseComponent } from './space-base-component.directive';

export abstract class SpaceItemsBaseComponent extends SpaceBaseComponent {
	protected constructor(className: string, parentPagePath: string) {
		super(className);
		this.$defaultBackUrlSpacePath.set(parentPagePath);
	}
}
