import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { ContactusServicesModule } from '@sneat/contactus-services';
import {
	HappeningType,
	WeekdayCode2,
	IHappeningContext,
	newEmptyHappeningContext,
} from '@sneat/mod-schedulus-core';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { SpaceServiceModule } from '@sneat/space-services';
import { first } from 'rxjs';
import { CalendarBasePage } from '../calendar-base-page';
import { HappeningFormComponent } from '@sneat/extensions-schedulus-shared';

@Component({
	selector: 'sneat-happening-new',
	templateUrl: './new-happening-page.component.html',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		HappeningFormComponent,
		ContactusServicesModule,
		SpaceServiceModule,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonContent,
	],
	providers: [SpaceComponentBaseParams],
})
export class NewHappeningPageComponent extends CalendarBasePage {
	@ViewChild('happeningPageFormComponent')
	happeningPageFormComponent?: HappeningFormComponent;

	protected isToDo: boolean;

	// protected initialHappeningType?: HappeningType;
	protected wd?: WeekdayCode2;
	protected date?: string;

	protected readonly $happening = signal<IHappeningContext>({
		id: '',
		space: { id: '' },
	});

	constructor() {
		super('NewHappeningPageComponent');
		this.isToDo = location.pathname.includes('/new-task');
		this.date = (history.state.date as string) || '';
		console.log('date', this.date);

		const type = window.history.state.type as HappeningType;
		if (type && this.space?.id && !this.$happening().id) {
			this.createHappeningContext(type);
		}
		this.route.queryParamMap
			.pipe(this.takeUntilDestroyed(), first())
			.subscribe({
				next: (queryParams) => {
					console.log(
						'NewHappeningPage.constructor() => queryParams:',
						queryParams,
					);
					const type = queryParams.get('type');
					if (type !== 'single' && type !== 'recurring') {
						console.warn('unknown happening type passed in URL: type=' + type);
						return;
					}
					if (this.space && !this.$happening().id) {
						this.createHappeningContext(type);
					}
					if (!this.wd) {
						this.wd = queryParams.get('wd') as WeekdayCode2;
					}
					if (!this.date) {
						this.date = queryParams.get('date') || '';
					}
					// if (!this.initialHappeningType) {
					// 	this.initialHappeningType = queryParams.get('type') as HappeningType;
					// }
				},
				error: this.logErrorHandler('failed to get query params'),
			});
		this.spaceChanged$.pipe(this.takeUntilDestroyed()).subscribe({
			next: () => {
				const happening = this.$happening();
				if (happening) {
					this.$happening.set({ ...happening, space: this.space });
				}
			},
		});
	}

	private createHappeningContext(type: HappeningType): void {
		console.log('createHappeningContext()', type);
		const space = this.space;
		if (!space) {
			throw new Error('!space');
		}
		this.$happening.set(
			newEmptyHappeningContext(space, type, 'activity', 'active'),
		);
	}

	// TODO(fix): protected onCommuneIdsChanged() {
	//     super.onCommuneIdsChanged();
	//     this.subscriptions.push(this.memberService.watchByCommuneId(this.communeRealId).subscribe(members => {
	//         this.members = members.map(m => new Member(m));
	//         this.members.sort((a, b) => a.title > b.title ? 1 : b.title > a.title ? -1 : 0); // TODO: Decouple
	//         this.adults = this.members.filter(m => m.dto.age === 'adult');
	//         this.kids = this.members.filter(m => m.dto.age === 'child');
	//     }));
	// }

	protected onHappeningChanged(happening: IHappeningContext): void {
		console.log('NewHappeningPageComponent.onHappeningChanged()', happening);
		const happeningType = happening.brief?.type;
		const typeChange = happeningType && happeningType !== happening.brief?.type;
		this.$happening.set(happening);
		if (typeChange) {
			this.onHappeningTypeChanged(happeningType);
		}
	}

	private onHappeningTypeChanged(happeningType: HappeningType): void {
		console.log('onHappeningTypeChanged()', happeningType);
		let { href } = location;
		if (!href.includes('?')) {
			href += '?type=';
		}
		href = href.replace(/type=\w*/, `type=${happeningType}`);
		history.replaceState(history.state, document.title, href);
	}
}
