import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { IHappeningWithUiState, IMemberBrief } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { MembersSelectorService } from '@sneat/team/components';
import { IHappeningContext, IMemberContext, ITeamContext } from '@sneat/team/models';
import { TeamNavService } from '@sneat/team/services';
import { NEVER, Observable, takeUntil } from 'rxjs';
import { HappeningService } from '../../services/happening.service';

@Component({
	selector: 'sneat-happening-card',
	templateUrl: 'happening-card.component.html',
	styleUrls: ['happening-card.component.scss'],
})
export class HappeningCardComponent implements OnChanges, OnDestroy {
	private readonly destroyed = new EventEmitter<void>();

	@Input() team?: ITeamContext;
	@Input() happening?: IHappeningContext;

	@Output() readonly deleted = new EventEmitter<string>();

	public deleting = false;

	readonly id = (i: number, v: { id: string }): string => v.id;
	readonly index = (i: number): number => i;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly happeningService: HappeningService,
		private readonly teamNavService: TeamNavService,
		private readonly membersSelectorService: MembersSelectorService,
	) {
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	public notImplemented(): void {
		alert('Sorry, not implemented yet.');
	}

	goHappening(event: Event): void {
		event.stopPropagation();
		if (!this.team) {
			this.errorLogger.logErrorHandler('not able to navigate to happening without team context');
			return;
		}
		this.teamNavService.navigateForwardToTeamPage(this.team, `happening/${this.happening?.id}`, {
			state: { happening: this.happening },
		}).catch(this.errorLogger.logErrorHandler('failed to navigate to happening page'));
		// this.navigateForward('regular-activity', { id: activity.id }, { happeningDto: activity }, { excludeCommuneId: true });
	}

	delete(event: Event): void {
		console.log('HappeningCardComponent.delete()');
		event.stopPropagation();
		if (!this.happening) {
			this.errorLogger.logError(new Error('Single happening card has no happening context at moment of delete attempt'));
			return;
		}
		this.deleting = true;

		const happening: IHappeningContext = this.happening.team ? this.happening : { ...this.happening, team: this.team };

		this.happeningService
			.deleteHappening(happening)
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: () => this.deleted.emit(),
				error: e => {
					this.errorLogger.logError(e, 'Failed to delete happening');
					this.deleting = false;
				},
			});
	}

	selectMembers(event: Event): void {
		event.stopPropagation();
		const teamID = this.team?.id;
		if (!teamID) {
			return;
		}
		this.membersSelectorService.selectMembers({
			teamIDs: this.happening?.dto?.teamIDs || [teamID],
			selectedMemberIDs: this.happening?.brief?.memberIDs || [],
			members: this.team?.dto?.members,
			onAdded: this.onMemberAdded,
			onRemoved: this.onMemberRemoved,
		}).catch(err => {
			this.errorLogger.logError(err, 'Failed to select members');
		})
	}

	private readonly onMemberAdded = (teamID: string, memberID: string): Observable<void> => {
		if (!this.happening) {
			return NEVER;
		}
		return this.happeningService.addMember(this.happening, memberID);
	}

	private readonly onMemberRemoved = (teamID: string, memberID: string): Observable<void> => {
		if (!this.happening) {
			return NEVER;
		}
		return this.happeningService.removeMember(this.happening, memberID);
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('HappeningCardComponent.ngOnChanges()', changes);
	}

	removeMember(member: IMemberContext): void {
		console.log('removeMember', member);
		if (!this.happening) {
			return;
		}
		this.happeningService.removeMember(this.happening, member.id).subscribe({
			next: () => {
				if (this.happening?.brief?.memberIDs) {
					this.happening.brief.memberIDs = this.happening.brief.memberIDs.filter(id => id !== member.id);
				}
				if (this.happening?.dto?.memberIDs) {
					this.happening.dto.memberIDs = this.happening.dto.memberIDs.filter(id => id !== member.id);
				}
			},
			error: this.errorLogger.logErrorHandler('Failed to remove member from happening'),
		});
	}
}
