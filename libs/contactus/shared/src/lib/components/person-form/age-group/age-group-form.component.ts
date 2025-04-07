import { CommonModule } from '@angular/common';
import {
	Component,
	computed,
	EventEmitter,
	input,
	Input,
	Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { formNexInAnimation, SpaceType } from '@sneat/core';
import { AgeGroupID } from '@sneat/contactus-core';
import { ISelectItem, SelectFromListComponent } from '@sneat/ui';

@Component({
	selector: 'sneat-age-group-form',
	templateUrl: 'age-group-form.component.html',
	animations: [formNexInAnimation],
	imports: [CommonModule, IonicModule, FormsModule, SelectFromListComponent],
})
export class AgeGroupFormComponent {
	@Input({ required: true }) spaceType?: SpaceType;

	public readonly $ageGroup = input.required<AgeGroupID | undefined>();

	@Output() readonly ageGroupChange = new EventEmitter<
		AgeGroupID | undefined
	>();
	@Input() disabled = false;

	public readonly hidePetOption = input<boolean>();
	public readonly hideCompanyOption = input<boolean>();
	public readonly hideUndisclosedOption = input<boolean>();

	protected $ageGroupLabel = computed(() => {
		const hidePetOptions = this.hidePetOption(),
			hideCompanyOption = this.hideCompanyOption();

		if (hidePetOptions && hideCompanyOption) {
			return 'Adult or child?';
		}
		if (!hidePetOptions && hideCompanyOption) {
			return 'Adult/child or pet?';
		}
		if (hidePetOptions && !hideCompanyOption) {
			return 'Adult/child or company?';
		}
		return 'Adult/child/pet or company?';
	});

	protected readonly $ageGroupOptions = computed<readonly ISelectItem[]>(() => {
		const hidePetOptions = this.hidePetOption(),
			hideCompanyOption = this.hideCompanyOption();

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
		if (!hideCompanyOption) {
			items.push({
				id: 'company',
				title: 'Company',
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
