import { ActivatedRoute, ParamMap } from '@angular/router';
import { IContactBrief, IContactDto } from '@sneat/dto';
import { TeamItemBaseComponent } from '@sneat/team/components';
import { IContactContext } from '@sneat/team/models';
import { Observable, throwError } from 'rxjs';
import { ContactComponentBaseParams } from '../contact-component-base-params';
import { ContactService } from '../services';

export abstract class ContactBasePage extends TeamItemBaseComponent<IContactBrief, IContactDto> {

	public contact?: IContactContext;
	public contactLocations?: IContactContext[];

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
		console.log('ContactBasePage.onRouteParamsChanged()', params, itemID, teamID);
	}

	protected override watchItemChanges(): Observable<IContactContext> {
		if (!this.contact?.id) {
			return throwError(() => new Error('no contact context'));
		}
		const team = this.team;
		if (!team) {
			return throwError(() => new Error('no team context'));
		}
		return this.contactService.watchContactById(team, this.contact?.id);
	}

	override setItemContext(item: IContactContext): void {
		this.contact = item;
	}

	override get item(): IContactContext | undefined {
		return this.contact;
	}

	protected override briefs(): IContactBrief[] | undefined {
		throw new Error('Method not implemented yet.');
	}


	private tackContactId(): void {
		this.route.paramMap
			.pipe(this.takeUntilNeeded())
			.subscribe({
				next: params => {
					const id = params.get('contactID');
					if (id) {
						if (this.contact?.id !== id) {
							const team = this.team;
							if (!team) {
								throw new Error('No team context');
							}
							this.contact = { id, team };
						}
					} else {
						this.contact = undefined;
					}
				},
				error: this.logErrorHandler(),
			});
	}

}
