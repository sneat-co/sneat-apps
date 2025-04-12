import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	OnInit,
	signal,
	ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParamMap } from '@angular/router';
import { IonInput } from '@ionic/angular';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonNav,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { ContactusServicesModule } from '@sneat/contactus-services';
import {
	OptionalContactGroupIdAndBrief,
	OptionalContactRoleIdAndBrief,
	NewContactFormComponent,
} from '@sneat/contactus-shared';
import {
	ContactRole,
	ContactToContactRelation,
	IContactContext,
} from '@sneat/contactus-core';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/space-components';
import { IAssetContext } from '@sneat/mod-assetus-core';
import { SpaceServiceModule } from '@sneat/space-services';

@Component({
	providers: [SpaceComponentBaseParams],
	imports: [
		CommonModule,
		FormsModule,
		SpaceServiceModule,
		ContactusServicesModule,
		IonNav,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonContent,
		NewContactFormComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-new-contact-page',
	templateUrl: './new-contact-page.component.html',
})
export class NewContactPageComponent
	extends SpaceBaseComponent
	implements OnInit
{
	@ViewChild('nameInput', { static: true }) nameInput?: IonInput;

	// TODO: relationship is not implemented yet
	protected $relation = signal<ContactToContactRelation | undefined>(undefined);

	public readonly $contact = signal<IContactContext>({} as IContactContext);

	protected readonly $contactGroupID = signal<string>('');
	protected readonly $contactRoleID = signal<ContactRole | undefined>(
		undefined,
	);
	protected readonly $assetID = signal<string>('');

	protected readonly $contactRole =
		signal<OptionalContactRoleIdAndBrief>(undefined);
	protected readonly $contactGroup =
		signal<OptionalContactGroupIdAndBrief>(undefined);

	protected readonly $parentContactID = signal<string>('');

	protected readonly $title = computed(() => {
		const contactRoleBrief = this.$contactRole()?.brief;
		return contactRoleBrief
			? `${contactRoleBrief.emoji} New ${contactRoleBrief.title.toLowerCase()}`
			: 'New contact';
	});

	protected readonly $asset = signal<IAssetContext | undefined>(undefined);

	constructor() {
		super('NewContactPageComponent');
		this.defaultBackPage = 'contacts';
		this.$asset.set(window.history.state.asset as IAssetContext);
	}

	// onContactTypeChanged(v: ContactRole): void {
	//
	// }

	override ngOnInit(): void {
		super.ngOnInit();
		this.route.queryParamMap
			.pipe(this.takeUntilDestroyed())
			.subscribe(this.onUrlParamsChanged);
	}

	private readonly onUrlParamsChanged = (params: ParamMap): void => {
		const relation = params.get('relation');
		if (relation) {
			this.$relation.set(relation as ContactToContactRelation);
		}
		const contactGroupID = params.get('group');
		if (contactGroupID && contactGroupID !== this.$contactGroupID()) {
			this.$contactGroupID.set(contactGroupID);
		}
		const contactRole = params.get('role');

		if (contactRole && !this.$contactRole()) {
			this.$contactRoleID.set(contactRole as ContactRole);
		}

		const space = this.space;
		if (!space) {
			throw new Error('Space is not defined');
		}

		const assetId = params.get('asset');
		if (assetId && assetId !== this.$assetID()) {
			this.$assetID.set(assetId);
		}
		const parentContactID = params.get('contact');
		if (parentContactID && this.$parentContactID() !== parentContactID) {
			this.$parentContactID.set(parentContactID);
		}
	};

	protected onContactChanged(contact: IContactContext): void {
		console.log('onContactChanged', contact);
		this.$contact.set(contact);
	}
}
