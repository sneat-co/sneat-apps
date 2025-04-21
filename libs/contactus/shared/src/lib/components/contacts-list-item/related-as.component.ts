import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from '@angular/core';
import { IonText } from '@ionic/angular/standalone';
import { ISpaceRef } from '@sneat/core';
import { getRelatedItemByKey, IRelatedTo } from '@sneat/dto';

@Component({
	selector: 'sneat-related-as',
	templateUrl: 'related-as.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IonText],
})
export class RelatedAsComponent {
	public $spaceRef = input.required<ISpaceRef>();
	public $itemID = input.required<string>();
	public $moduleID = input.required<string>();
	public $collectionID = input.required<string>();

	public readonly $relatedTo = input.required<IRelatedTo>();

	public $relatedTitle = computed(() => this.$relatedTo().title);
	public $relatedItemsOfRelatedItem = computed(() => this.$relatedTo().related);

	protected readonly $relatedAsRoles = computed(() => {
		const relatedItem = getRelatedItemByKey(this.$relatedItemsOfRelatedItem(), {
			module: this.$moduleID(),
			collection: this.$collectionID(),
			space: this.$spaceRef().id,
			itemID: this.$itemID(),
		});
		return relatedItem?.rolesToItem
			? Object.keys(relatedItem.rolesToItem)
			: undefined;
	});
}
