import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IMemberBrief } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { Subject } from 'rxjs';
import { ISelectMembersOptions } from './member-selector.options';


@Component({
	selector: 'sneat-members-selector',
	templateUrl: 'members-selector.component.html',
})
export class MembersSelectorComponent implements OnInit, OnChanges, OnDestroy {

	private readonly destroyed = new Subject<void>();

	@Input() foo?: string;
	@Input() options?: ISelectMembersOptions;

	public members?: readonly IMemberBrief[];
	private selectedIDs: string[] = [];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
	) {
		console.log('MembersSelectorComponent.constructor()');
	}

	ngOnInit(): void {
		this.processOptions();
	}

	close(event: Event): void {
		event.stopPropagation();
		this.modalController.dismiss()
			.catch(this.errorLogger.logErrorHandler('Failed to dismiss members selector modal'));
	}

	isSelected(id: string): boolean {
		return this.selectedIDs.includes(id);
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('MembersSelectorComponent.ngOnChanges()', changes);
		const options = changes['options'];
		if (options) {
			this.processOptions();
		}
	}

	onCheckboxChanged(event: Event): void {
		if (!this.options?.teamIDs?.length) {
			return;
		}
		const ce = event as CustomEvent;
		console.log('onCheckboxChanged()', ce.detail);
		const checked: boolean = ce.detail.checked;
		if (checked) {
			if (this.options?.onAdded) {
				this.options.onAdded(this.options.teamIDs[0], ce.detail.value).subscribe({
					error: this.errorLogger.logErrorHandler('Failed in onAdded handler'),
				});
			}
		} else {
			if (this.options.onRemoved) {
				this.options.onRemoved(this.options.teamIDs[0], ce.detail.value).subscribe({
					error: this.errorLogger.logErrorHandler('Failed in onRemoved handler'),
				});
			}
		}
	}

	private processOptions(): void {
		console.log('processOptions()', this.foo, this.options);
		if (this.options?.members) {
			this.members = this.options.members;
		}
		if (this.options?.selectedMemberIDs) {
			this.selectedIDs = [...this.options.selectedMemberIDs];
		}
	}

	ngOnDestroy(): void {
		this.destroyed.next();
	}
}
