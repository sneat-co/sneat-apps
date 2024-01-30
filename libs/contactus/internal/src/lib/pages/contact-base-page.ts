import { ActivatedRoute, ParamMap } from '@angular/router';
import { ContactComponentBaseParams } from '@sneat/contactus-shared';
import {
	IContactBrief,
	IContactDto,
	IContactContext,
} from '@sneat/contactus-core';
import { TeamItemPageBaseComponent } from '@sneat/team-components';
import { Observable, throwError } from 'rxjs';

export abstract class ContactBasePage extends TeamItemPageBaseComponent<
	IContactBrief,
	IContactDto
> {
	public contact?: IContactContext;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		params: ContactComponentBaseParams,
		// protected preloader: NgModulePreloaderService,
	) {
		super(
			className,
			route,
			params.teamParams,
			'contacts',
			'contact',
			params.contactService,
		);
		this.defaultBackPage = 'contacts';
		this.tackContactId();
	}

	protected override onRouteParamsChanged(
		params: ParamMap,
		itemID?: string,
		teamID?: string,
	) {
		// Nothing to do here
		console.log(
			'ContactBasePage.onRouteParamsChanged()',
			params,
			itemID,
			teamID,
		);
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
		super.setItemContext(item);
		this.contact = item;
	}

	protected override briefs(): Record<string, IContactBrief> | undefined {
		return this.contactusTeam?.dto?.contacts;
	}

	private tackContactId(): void {
		this.route.paramMap.pipe(this.takeUntilNeeded()).subscribe({
			next: (params) => {
				const id = params.get('contactID');
				if (id) {
					if (this.contact?.id !== id) {
						const team = this.team;
						if (!team) {
							throw new Error('No team context');
						}
						this.contact = {
							id,
							brief: undefined,
							dto: undefined,
							team: this.team,
						};
					}
				} else {
					this.contact = undefined;
				}
			},
			error: this.logErrorHandler(),
		});
	}
}
