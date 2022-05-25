import { ActivatedRoute } from '@angular/router';
import { IContactBrief, IContactDto } from '@sneat/dto';
import { TeamItemBaseComponent } from '@sneat/team/components';
import { IContactContext } from '@sneat/team/models';
import { ContactComponentBaseParams } from '../contact-component-base-params';

export abstract class ContactBasePage extends TeamItemBaseComponent<IContactBrief, IContactDto> {

	public contact?: IContactContext;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		params: ContactComponentBaseParams,
		// protected preloader: NgModulePreloaderService,
		// protected assetService: IAssetService,
	) {
		super(className, route, params.teamParams, 'contacts', 'contact', (id: string) => params.contactService.watchById(id));
		this.defaultBackPage = 'contacts';
		this.tackContactId();
	}

	override setItemContext(item: IContactContext): void {
		this.contact = item;
	}

	override get item(): IContactContext | undefined {
		return this.contact;
	}

	protected override briefs(): IContactBrief[] | undefined {
		return this?.team?.dto?.contacts;
	}


	private tackContactId(): void {
		this.route.paramMap
			.pipe(this.takeUntilNeeded())
			.subscribe({
				next: params => {
					const id = params.get('contactID');
					if (id) {
						if (this.contact?.id !== id) {
							this.contact = { id };
						}
					} else {
						this.contact = undefined;
					}
				},
				error: this.logErrorHandler(),
			});
	}
}
