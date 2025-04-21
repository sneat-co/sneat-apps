import {
	ChangeDetectionStrategy,
	Component,
	computed,
	EventEmitter,
	input,
	Input,
	Output,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonSpinner,
} from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import { formNexInAnimation } from '@sneat/core';
import { IRelatedChange } from '@sneat/contactus-core';
import {
	getRelatedItemByKey,
	IRelatedTo,
	IRelationshipRole,
	ISpaceModuleItemRef,
} from '@sneat/dto';
import { ISelectItem, SelectFromListComponent } from '@sneat/ui';
import { SpaceRelatedFormComponent } from '../space-related-form.component';

interface IRelationshipWithID extends IRelationshipRole {
	readonly id: string;
}

@Component({
	animations: [formNexInAnimation],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		IonCard,
		IonItem,
		IonItemDivider,
		IonLabel,
		SelectFromListComponent,
		IonButtons,
		IonButton,
		IonIcon,
		IonSpinner,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-relationship-form',
	templateUrl: 'relationship-form.component.html',
})
export class RelationshipFormComponent extends SpaceRelatedFormComponent {
	public readonly $relatedTo = input.required<IRelatedTo | undefined>();

	public readonly $relationshipOptions = input.required<
		readonly ISelectItem[] | undefined
	>();

	public readonly $isProcessing = input<boolean>();

	protected readonly $rolesOfItemRelatedToTarget = computed<
		readonly IRelationshipWithID[] | undefined
	>(() => {
		const relatedTo = this.$relatedTo();
		if (!relatedTo?.related) {
			return undefined;
		}
		const relatedItem = getRelatedItemByKey(relatedTo.related, relatedTo.key);
		console.log('$rolesOfItemRelatedToTarget', relatedTo, relatedItem);
		if (!relatedItem) {
			return []; // if we return undefined, the "loading..." spinner will be shown
		}
		const rolesToItem: IRelationshipWithID[] = [];
		Object.entries(relatedItem.rolesToItem || {}).forEach(([id, rel]) => {
			const roleOfItem: IRelationshipWithID = {
				id,
				...rel,
			};
			rolesToItem.push(roleOfItem);
		});
		return rolesToItem;
	});

	protected readonly $hasRelationships = computed(
		() => !!this.$rolesOfItemRelatedToTarget()?.length,
	);

	protected readonly $useSelect = computed(() => {
		const n = this.$rolesOfItemRelatedToTarget()?.length;
		return n === 0 || n === 1;
	});

	@Output() readonly relatedAsChange = new EventEmitter<IRelatedChange>();

	@Input() public isActive = false;
	@Input() public disabled = false;

	protected readonly relatedAsSingle = new FormControl<string>('');

	constructor(private readonly userService: SneatUserService) {
		super('RelationshipFormComponent');
	}

	// Defined here as it is used in the template twice
	protected readonly label = 'Related to me as';

	protected onRelationshipChanged(value: string): void {
		console.log('onRelationshipChanged()', value);
		// this.relatedAsRelationships = [value];
		this.relatedAsChange.emit({ add: { rolesToItem: [value] } });
	}

	protected openAddRelationship(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		alert('Not implemented yet');
	}

	protected removeRelationship(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		console.log('removeRelationship()', event);
		alert('Not implemented yet');
	}
}
