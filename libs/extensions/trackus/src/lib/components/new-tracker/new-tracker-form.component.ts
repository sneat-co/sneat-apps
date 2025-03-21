import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
	IonButton,
	IonInput,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonLabel,
	IonRadio,
	IonRadioGroup,
} from '@ionic/angular/standalone';
import { ISelectItem, SelectFromListModule } from '@sneat/components';

@Component({
	selector: 'sneat-new-tracker-form',
	templateUrl: './new-tracker-form.component.html',
	imports: [
		IonLabel,
		IonItem,
		IonInput,
		IonRadioGroup,
		IonRadio,
		SelectFromListModule,
		ReactiveFormsModule,
		IonItemDivider,
		IonButton,
		IonItemGroup,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTrackerFormComponent {
	public readonly category = input.required<string>();
	protected readonly $category = signal<string | undefined>(undefined);
	protected readonly $categoryState = computed(() => {
		const category = this.$category();
		return category === undefined ? this.category() : category;
	});
	protected readonly $valueType = signal<string>('');
	protected readonly $numberType = signal<'fixed' | 'cumulative' | undefined>(
		undefined,
	);

	readonly typeOptions: readonly ISelectItem[] = [
		{
			id: 'int',
			title: 'Integer number',
		},
		{
			id: 'float',
			title: 'Float number',
		},
	];

	readonly categories: readonly ISelectItem[] = [
		{
			id: 'fitness',
			title: 'Fitness',
		},
		{
			id: 'health',
			title: 'Health',
		},
	];
}
