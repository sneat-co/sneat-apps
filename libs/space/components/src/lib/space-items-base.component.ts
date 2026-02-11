import { SpaceBaseComponent } from './space-base-component.directive';

export abstract class SpaceItemsBaseComponent extends SpaceBaseComponent {
  protected constructor(parentPagePath: string) {
    super();
    this.$defaultBackUrlSpacePath.set(parentPagePath);
  }
}
