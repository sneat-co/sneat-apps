import { Component, Injectable, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';

@Component({template: ''})
export abstract class TeamRelatedFormComponent implements OnChanges {
	ngOnChanges(changes: SimpleChanges): void {
		const teamChange = changes['team'];
		if (teamChange) {
			this.onTeamChanged(teamChange);
		}
	}

	protected onTeamChanged(teamChange: SimpleChange): void {
		const previous = teamChange.previousValue as ITeamContext | undefined;
		const current = teamChange.currentValue as ITeamContext | undefined;
		if (previous?.type !== current?.type) {
			this.onTeamTypeChanged(current);
		}
	}

	protected onTeamTypeChanged(team?: ITeamContext): void {
		//
	}
}
