import { ActivatedRoute, ParamMap } from '@angular/router';
import { IContactBrief, IContactDto } from '@sneat/dto';
import { TeamItemBaseComponent } from '@sneat/team/components';
import { IContactContext } from '@sneat/team/models';
import { Observable, throwError } from 'rxjs';
import { ContactComponentBaseParams } from '../contact-component-base-params';
import { ContactService } from '../contact.service';

export abstract class ContactBasePage extends TeamItemBaseComponent<IContactBrief, IContactDto> {

	public contact?: IContactContext;

	protected readonly contactService: ContactService;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		params: ContactComponentBaseParams,
		// protected preloader: NgModulePreloaderService,
		// protected assetService: IAssetService,
	) {
		super(className, route, params.teamParams, 'contacts', 'contact');
		this.contactService = params.contactService;
		this.defaultBackPage = 'contacts';
		this.tackContactId();
	}

	protected override onRouteParamsChanged(params: ParamMap, itemID?: string, teamID?: string) {
		// Nothing to do here
	}

	protected override watchItemChanges(): Observable<IContactContext> {
		if (!this.contact?.id) {
			return throwError(() => new Error('no contact context'));
		}
		return this.contactService.watchById(this.contact?.id);
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
