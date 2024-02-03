import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { first, Observable } from 'rxjs';

@Component({
	selector: 'sneat-members-selector-list',
	templateUrl: 'members-selector-list.component.html',
})
export class MembersSelectorListComponent {
	// Intentionally removed @Input() team: ITeamContext = { id: '' };
	@Input() public members?: readonly IIdAndBrief<IContactBrief>[];
	@Input() selectedMembers?: readonly IIdAndBrief<IContactBrief>[];
	@Output() readonly selectedMembersChange = new EventEmitter<
		readonly IIdAndBrief<IContactBrief>[]
	>();
	@Input() max?: number;
	@Input() onAdded?: (member: IIdAndBrief<IContactBrief>) => Observable<void>;
	@Input() onRemoved?: (member: IIdAndBrief<IContactBrief>) => Observable<void>;

	private disabledMemberIDs: string[] = [];

	protected readonly useCheckbox = true;
	// protected get useCheckbox(): boolean {
	// 	const max = this.max;
	// 	// The `!max && max !== 0` is to properly check for possible null
	// 	// that sometimes is not get caught by TypeScript
	// 	return !max && max !== 0 || max > 1;
	// }

	constructor(@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger) {
		console.log('MembersSelectorComponent.constructor()');
	}

	readonly fullMemberID = (_: number, m: IIdAndBrief<IContactBrief>) =>
		// `${m.team?.id}:${m.id}`;
		`$${m.id}`;

	protected isSelected(member: IIdAndBrief<IContactBrief>): boolean {
		return !!this.selectedMembers?.some(
			(m) => m.id === member.id /*&& m.team?.id === member?.team?.id*/,
		);
	}

	protected isDisabled(memberID: string): boolean {
		return this.disabledMemberIDs.includes(memberID);
	}

	protected onRadioChanged(event: Event): void {
		event.stopPropagation();
		console.log('onRadioChanged()', event);
		const selectedMembers = this.selectedMembers;
		this.selectedMembers = [];
		if (selectedMembers?.length) {
			this.selectedMembers.forEach(this.onMemberRemoved);
		}
		this.onIonChange(event, true);
	}

	protected onCheckboxChanged(event: Event): void {
		console.log('onCheckboxChanged', event);
		const ce = event as CustomEvent;
		this.onIonChange(event, ce.detail.checked);
	}

	private onIonChange(event: Event, checked: boolean): void {
		if (!this.members) {
			return;
		}
		const ce = event as CustomEvent;
		const memberID: string = ce.detail.value;
		const member = this.members?.find((m) => m.id === memberID);
		if (!member) {
			throw new Error('member not found by ID=' + memberID);
		}
		// if (!member.team) {
		// 	throw new Error('member context has no team context');
		// }
		console.log('onIonChange()', ce.detail);
		let changed: boolean;
		if (checked) {
			changed = this.onMemberAdded(member);
		} else {
			changed = this.onMemberRemoved(member);
		}
		if (changed) {
			this.selectedMembersChange.emit(this.selectedMembers || []);
		}
	}

	private getSelectedMemberIDs(): string[] {
		return this.selectedMembers?.map((m) => m.id) || [];
	}

	private onMemberAdded(member: IIdAndBrief<IContactBrief>): boolean {
		console.log('MembersSelectorListComponent.onMemberAdded()', member);
		const selectedIDs = this.getSelectedMemberIDs();
		if (!selectedIDs.includes(member.id)) {
			selectedIDs.push(member.id);
			if (
				this.selectedMembers &&
				!this.selectedMembers?.some((m) => m.id === member.id)
			) {
				this.selectedMembers = [...this.selectedMembers, member];
			} else {
				this.setSelectedMembers(selectedIDs);
			}
			if (this.onAdded) {
				this.disabledMemberIDs.push(member.id);
				this.onAdded(member)
					.pipe(first())
					.subscribe({
						next: () => {
							this.disabledMemberIDs = this.disabledMemberIDs.filter(
								(id) => id !== member.id,
							);
						},
						error: (e) => {
							this.errorLogger.logError(e, 'Failed in onAdded handler');
							this.selectedMembers = this.selectedMembers?.filter(
								(m) => m.id !== member.id,
							);
							this.disabledMemberIDs = this.disabledMemberIDs.filter(
								(id) => id !== member.id,
							);
						},
					});
			}
			return true;
		}
		return false;
	}

	private readonly onMemberRemoved = (
		member: IIdAndBrief<IContactBrief>,
	): boolean => {
		console.log('MembersSelectorListComponent.onMemberRemoved()', member);
		let selectedIDs = this.getSelectedMemberIDs();
		if (!selectedIDs.includes(member.id)) {
			return false;
		}
		selectedIDs = selectedIDs.filter((id) => id != member.id);
		this.setSelectedMembers(selectedIDs);
		if (this.onRemoved) {
			this.disabledMemberIDs.push(member.id);
			this.onRemoved(member).subscribe({
				next: () => {
					this.disabledMemberIDs = this.disabledMemberIDs.filter(
						(id) => id !== member.id,
					);
				},
				error: (e) => {
					this.disabledMemberIDs = this.disabledMemberIDs.filter(
						(id) => id !== member.id,
					);
					this.errorLogger.logError(e, 'Failed in onRemoved handler');
				},
			});
		}
		return true;
	};

	private setSelectedMembers(
		selectedIDs: string[],
	): readonly IIdAndBrief<IContactBrief>[] {
		const selectedMembers: IIdAndBrief<IContactBrief>[] = [];
		selectedIDs.forEach((id) => {
			const m = this.members?.find((m) => m.id === id);
			if (!m) {
				console.error(
					`Selected member not found by ID=${id}, known IDs=${this.getSelectedMemberIDs().join(
						',',
					)}`,
				);
				return;
			}
			selectedMembers.push(m);
		});
		this.selectedMembers = selectedMembers;
		this.selectedMembersChange.emit(selectedMembers);
		return selectedMembers;
	}
}
