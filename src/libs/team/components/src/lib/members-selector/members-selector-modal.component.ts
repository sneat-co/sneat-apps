import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IMemberBrief } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IMemberContext, ITeamContext } from '@sneat/team/models';
import { memberContextFromBrief } from '@sneat/team/services';
import { Observable, Subject } from 'rxjs';
import { ISelectMembersOptions } from './member-selector.options';


@Component({
	selector: 'sneat-members-selector-modal',
	templateUrl: 'members-selector-modal.component.html',
})
export class MembersSelectorModalComponent implements ISelectMembersOptions, OnChanges, OnDestroy {

	private readonly destroyed = new Subject<void>();

	@Input() team: ITeamContext = {id: ''};
	@Input() selectedMemberIDs: string[] = [];
	@Input() max?: number;
	@Input() onAdded?: (teamID: string, memberID: string) => Observable<void>;
	@Input() onRemoved?: (teamID: string, memberID: string) => Observable<void>;

	public members?: readonly IMemberContext[];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
	) {
		console.log('MembersSelectorComponent.constructor()');
	}

	close(event: Event): void {
		event.stopPropagation();
		this.modalController.dismiss()
			.catch(this.errorLogger.logErrorHandler('Failed to dismiss members selector modal'));
	}

	isSelected(id: string): boolean {
		return this.selectedMemberIDs.includes(id);
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('MembersSelectorComponent.ngOnChanges()', changes);
	}

	onCheckboxChanged(event: Event): void {
		if (!this.team.id) {
			return;
		}
		const ce = event as CustomEvent;
		console.log('onCheckboxChanged()', ce.detail);
		const checked: boolean = ce.detail.checked;
		if (checked) {
			if (this.onAdded) {
				this.onAdded(this.team.id, ce.detail.value).subscribe({
					error: this.errorLogger.logErrorHandler('Failed in onAdded handler'),
				});
			}
		} else {
			if (this.onRemoved) {
				this.onRemoved(this.team.id, ce.detail.value).subscribe({
					error: this.errorLogger.logErrorHandler('Failed in onRemoved handler'),
				});
			}
		}
	}

	ngOnDestroy(): void {
		this.destroyed.next();
	}
}
