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
import { IonicModule, IonInput } from '@ionic/angular';
import {
	ContactGroupIdAndBrief,
	ContactRoleFormComponent,
	ContactRoleIdAndBrief,
	NewContactFormComponent,
} from '@sneat/contactus-shared';
import {
	ContactToContactRelation,
	Gender,
	IPersonRequirements,
	IContactContext,
} from '@sneat/contactus-core';
import { AssetusServicesModule } from '@sneat/extensions-assetus-components';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/space-components';
import { IAssetContext } from '@sneat/mod-assetus-core';
import { SpaceServiceModule } from '@sneat/space-services';
import { first } from 'rxjs';
import { ContactusServicesModule } from '@sneat/contactus-services';

@Component({
	selector: 'sneat-new-contact-page',
	templateUrl: './new-contact-page.component.html',
	providers: [SpaceComponentBaseParams],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ContactusServicesModule,
		AssetusServicesModule,
		SpaceServiceModule,
		NewContactFormComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewContactPageComponent
	extends SpaceBaseComponent
	implements OnInit
{
	@ViewChild('nameInput', { static: true }) nameInput?: IonInput;

	protected relation?: ContactToContactRelation;
	protected name = '';
	protected gender?: Gender;
	protected email = '';
	protected phone = '';

	// public readonly relations: { id: string; title: string }[] = [
	// 	{ id: 'mother', title: 'Mother' },
	// 	{ id: 'father', title: 'Father' },
	// 	{ id: 'parent', title: 'Parent' },
	// 	{ id: 'grandparent', title: 'Grand-parent' },
	// 	{ id: 'sibling', title: 'Sibling' },
	// 	{ id: 'child', title: 'Child' },
	// 	{ id: 'gp', title: 'GP - Family Doctor' },
	// ];

	public readonly $contact = signal<IContactContext | undefined>(undefined);

	protected readonly $contactGroupID = signal<string>('');
	protected readonly $contactRoleID = signal<string>('');
	protected readonly $assetID = signal<string>('');

	protected readonly $contactRole = signal<ContactRoleIdAndBrief>(undefined);
	protected readonly $contactGroup = signal<ContactGroupIdAndBrief>(undefined);

	protected readonly $parentContactID = signal<string>('');

	protected readonly $title = computed(() => {
		const contactRoleBrief = this.$contactRole()?.brief;
		return contactRoleBrief
			? `${contactRoleBrief.emoji} New ${contactRoleBrief.title.toLowerCase()}`
			: 'New contact';
	});

	protected $asset = signal<IAssetContext | undefined>(undefined);

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
			this.relation = relation as ContactToContactRelation; // TODO: verify
		}
		const contactGroupID = params.get('group');
		if (contactGroupID && contactGroupID !== this.$contactGroupID()) {
			this.$contactGroupID.set(contactGroupID);
		}
		const contactRole = params.get('role');

		if (contactRole && !this.$contactRole()) {
			this.$contactRoleID.set(contactRole);
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
}
