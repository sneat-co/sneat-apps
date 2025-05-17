import {
	Component,
	computed,
	EventEmitter,
	input,
	Input,
	Output,
} from '@angular/core';
import { IonCard, IonItemDivider } from '@ionic/angular/standalone';
import { AgeGroupID, formNexInAnimation, SpaceType } from '@sneat/core';
import { ISelectItem, SelectFromListComponent } from '@sneat/ui';

@Component({
	selector: 'sneat-age-group-form',
	templateUrl: 'age-group-form.component.html',
	animations: [formNexInAnimation],
	imports: [SelectFromListComponent, IonCard, IonItemDivider],
})
export class AgeGroupFormComponent {
	@Input({ required: true }) spaceType?: SpaceType;

	public readonly $ageGroup = input.required<AgeGroupID | undefined>();

	@Output() readonly ageGroupChange = new EventEmitter<
		AgeGroupID | undefined
	>();
	@Input() disabled = false;

	public readonly hidePetOption = input<boolean>();
	public readonly hideUndisclosedOption = input<boolean>();

	protected $ageGroupLabel = computed(() => {
		const hidePetOptions = this.hidePetOption();

		if (hidePetOptions) {
			return 'Adult or child?';
		}
		return 'Adult/child or pet?';
	});

	protected readonly $ageGroupOptions = computed<readonly ISelectItem[]>(() => {
		const hidePetOptions = this.hidePetOption();

		const items: ISelectItem[] = [
			{
				id: 'adult',
				title: 'Adult',
			},
			{
				id: 'child',
				title: 'Child',
			},
		];
		if (!hidePetOptions) {
			items.push({
				id: 'pet',
				title: 'Pet',
			});
		}
		if (!this.hideUndisclosedOption) {
			items.push({
				id: 'undisclosed',
				title: 'Undisclosed',
			});
		}
		return items;
	});

	protected onAgeGroupChanged(ageGroup: string): void {
		console.log('AgeGroupFormComponent.onAgeGroupChanged', ageGroup);
		this.ageGroupChange.emit(ageGroup as AgeGroupID);
	}
}
