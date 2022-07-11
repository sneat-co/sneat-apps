import { AfterViewInit, Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ISelectItem, SelectorBaseComponent } from '@sneat/components';
import { ContactRole } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { Observable, Subject, Subscription } from 'rxjs';
import { ContactService } from '../../services';
import { IContactSelectorOptions } from './contact-selector.service';

@Component({
	selector: 'sneat-contact-selector',
	templateUrl: './contact-selector.component.html',
})
export class ContactSelectorComponent
	extends SelectorBaseComponent
	implements IContactSelectorOptions, AfterViewInit, OnChanges {

	@Input() team: ITeamContext = { id: '' };
	@Input() role?: ContactRole;
	@Input() excludeContacts?: IContactContext[];
	@Input() onSelected?: (item: IContactContext[] | null) => void;

	// @Input() public contacts?: IContactContext[];

	private sub?: Subscription;

	private contacts?: IContactContext[];

	protected itemID?: string;
	private readonly items$ = new Subject<IContactContext[]>;
	public readonly items = this.items$.asObservable();

	protected displayItems?: ISelectItem[];

	get label(): string {
		const r = this.role;
		return r ? r[0].toUpperCase() + r.substr(1) : 'Contact';
	}

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		modalController: ModalController,
		private readonly contactService: ContactService,
	) {
		super(errorLogger, modalController);
	}


	ngAfterViewInit(): void {
		console.log('ngAfterViewInit()');
		this.subscribeForData();
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('ngOnChanges()', changes);
		if (changes['role'] || changes['team']) {
			this.subscribeForData();
		}
	}

	subscribeForData(): void {
		console.log('ContactSelectorComponent.subscribeForData()');
		this.sub?.unsubscribe();
		if (!this.team) {
			return;
		}
		this.sub = this.contactService.watchContactsByRole(
			this.team,
			{ role: this.role, status: 'active' },
		).subscribe(contacts => {
			this.contacts = contacts;
			this.displayItems = contacts
				.filter(c => !this?.excludeContacts?.some(ec => ec.id === c.id))
				.map(c => ({
					id: c.id,
					title: c.brief?.title || c.id,
					iconName: 'people-outline',
				}));

			// console.log('contacts', this.contacts);
			console.log('items', this.displayItems);
		});
	}

	protected onContactSelected(itemID: string): void {
		console.log('onContactSelected()', itemID);
		if (this.onSelected) {
			const contact = this.contacts?.find(c => c.id === itemID);
			this.onSelected(contact ? [contact] : null);
		}
		this.close(undefined);
	}
}
