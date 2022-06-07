import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IMemberContext } from '@sneat/team/models';
import { Observable } from 'rxjs';

@Component({
	selector: 'sneat-members-selector-list',
	templateUrl: 'members-selector-list.component.html',
})
export class MembersSelectorListComponent {
	// Intentionally removed @Input() team: ITeamContext = { id: '' };
	@Input() public members?: readonly IMemberContext[];
	@Input() selectedMembers?: readonly IMemberContext[];
	@Output() readonly selectedMembersChange = new EventEmitter<readonly IMemberContext[]>();
	@Input() max?: number;
	@Input() onAdded?: (member: IMemberContext) => Observable<void>;
	@Input() onRemoved?: (member: IMemberContext) => Observable<void>;


	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
		console.log('MembersSelectorComponent.constructor()');
	}

	readonly fulLMemberID = (_: number, m: IMemberContext) => `${m.team?.id}:${m.id}`;

	isSelected(member: IMemberContext): boolean {
		return !!this.selectedMembers?.some(m => m.id === member.id && m.team?.id === member?.team?.id);
	}

	onRadioChanged(event: Event): void {
		event.stopPropagation();
		const selectedMembers = this.selectedMembers;
		this.selectedMembers = [];
		if (selectedMembers?.length) {
			this.selectedMembers.forEach(this.onMemberRemoved);
		}
		this.onIonChange(event, true);
	}

	onCheckboxChanged(event: Event): void {
		const ce = event as CustomEvent;
		this.onIonChange(event, ce.detail.checked);
	}

	private onIonChange(event: Event, checked: boolean): void {
		if (!this.members) {
			return;
		}
		const ce = event as CustomEvent;
		const memberID: string = ce.detail.value;
		const member = this.members?.find(m => m.id === memberID);
		if (!member) {
			throw new Error('member not found by ID=' + memberID);
		}
		if (!member.team) {
			throw new Error('member context has no team context');
		}
		console.log('onIonChange()', ce.detail);
		let changed: boolean;
		if (checked) {
			changed = this.onMemberAdded(member);
		} else {
			changed = this.onMemberRemoved(member);
		}
		if (changed) {
			this.selectedMembersChange.emit(this.selectedMembers || [])
		}
	}

	private getSelectedMemberIDs(): string[] {
		return this.selectedMembers?.map(m => m.id) || [];
	}

	private onMemberAdded(member: IMemberContext): boolean {
		console.log('MembersSelectorListComponent.onMemberAdded()', member);
		const selectedIDs = this.getSelectedMemberIDs();
		if (!selectedIDs.includes(member.id)) {
			selectedIDs.push(member.id);
			if (this.selectedMembers && !this.selectedMembers?.some(m => m.id === member.id)) {
				this.selectedMembers = [...this.selectedMembers, member];
			} else {
				this.setSelectedMembers(selectedIDs);
			}
			if (this.onAdded) {
				this.onAdded(member).subscribe({
					error: this.errorLogger.logErrorHandler('Failed in onAdded handler'),
				});
			}
			return true;
		}
		return false;
	}

	private readonly onMemberRemoved = (member: IMemberContext): boolean => {
		let selectedIDs = this.getSelectedMemberIDs();
		if (!selectedIDs.includes(member.id)) {
			return false;
		}
		selectedIDs = selectedIDs.filter(id => id != member.id);
		this.setSelectedMembers(selectedIDs);
		if (this.onRemoved) {
			this.onRemoved(member).subscribe({
				error: this.errorLogger.logErrorHandler('Failed in onRemoved handler'),
			});
		}
		return true;
	};

	private setSelectedMembers(selectedIDs: string[]): readonly IMemberContext[] {
		const selectedMembers: IMemberContext[] = [];
		selectedIDs.forEach(id => {
			const m = this.members?.find(m => m.id === id);
			if (!m) {
				console.error(`Selected member not found by ID=${id}, known IDs=${this.getSelectedMemberIDs().join(',')}`);
				return;
			}
			selectedMembers.push(m);
		})
		this.selectedMembers = selectedMembers;
		this.selectedMembersChange.emit(selectedMembers);
		return selectedMembers;
	}
}
