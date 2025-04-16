import { animate, style, transition, trigger } from '@angular/animations';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	inject,
	input,
	Input,
	Output,
	signal,
} from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonSpinner,
} from '@ionic/angular/standalone';
import { genderColor } from '@sneat/components';
import {
	Gender,
	GenderFemale,
	GenderMale,
	GenderOther,
	GenderUndisclosed,
} from '@sneat/contactus-core';
import { ContactService } from '@sneat/contactus-services';
import {
	ISelectItem,
	SelectFromListComponent,
	SneatBaseComponent,
} from '@sneat/ui';

const animationTimings = '150ms';

interface GenderOption {
	readonly id: Gender;
	readonly title: string;
	readonly iconName: string;
	readonly emoji?: string;
}

const genders: readonly GenderOption[] = [
	{ id: GenderMale, title: 'Male', iconName: 'man-outline', emoji: '👨' },
	{ id: GenderFemale, title: 'Female', iconName: 'woman-outline', emoji: '👩' },
	{ id: GenderOther, title: 'Other', iconName: 'person-outline' },
	// { id: GenderUnknown, title: 'Unknown', iconName: 'person-circle-outline' },
	{ id: GenderUndisclosed, title: 'Undisclosed', iconName: 'person' },
];

@Component({
	imports: [
		SelectFromListComponent,
		IonItemDivider,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonSpinner,
		IonItem,
	],
	animations: [
		trigger('radioOut', [
			transition(':leave', [animate(animationTimings, style({ height: 0 }))]),
		]),
		trigger('selectIn', [
			transition(':enter', [
				// style({ display: 'none' }), // initial styles
				animate(animationTimings),
			]),
		]),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-gender-form',
	templateUrl: './gender-form.component.html',
})
export class GenderFormComponent extends SneatBaseComponent {
	constructor() {
		super('GenderFormComponent');
	}

	protected readonly genderOptions: readonly ISelectItem[] = genders.map(
		(g) => ({
			id: g.id,
			title: g.title,
			iconName: g.iconName,
			iconColor: genderColor(g.id),
			emoji: g.emoji,
		}),
	);

	@Input() lastItemLines?: 'none' | 'inset' | 'full';

	@Input() hideSkipButton = false;

	@Input() disabled = false;

	public readonly $spaceID = input.required<string>();
	public readonly $contactID = input.required<string | undefined>();
	public readonly $genderID = input.required<Gender | undefined>();

	protected readonly $updatingToGender = signal<Gender | undefined>(undefined);

	@Output() genderChange = new EventEmitter<Gender>();

	private contactService = inject(ContactService);

	// @ViewChild(IonRadioGroup, { static: true }) radioGroup?: IonRadioGroup;

	protected skip(): void {
		this.onGenderChanged('undisclosed');
	}

	protected readonly $isChanging = signal(false);

	private onGenderChanged(gender: Gender): void {
		const contactID = this.$contactID();
		if (!gender) {
			gender = 'unknown';
		}
		if (!contactID || gender == this.$genderID()) {
			return;
		}
		this.$updatingToGender.set(gender);
		this.contactService
			.updateContact({
				gender: gender,
				spaceID: this.$spaceID(),
				contactID: contactID,
			})
			.subscribe({
				next: () => {
					this.genderChange.emit(gender);
					this.$updatingToGender.set(undefined);
				},
				error: (err) => {
					this.errorLogger.logError(
						err,
						'Failed to change gender of a contact',
					);
					this.$updatingToGender.set(undefined);
				},
			});
	}

	protected onGenderIDChanged(genderID: string): void {
		this.onGenderChanged(genderID as Gender);
	}
}
