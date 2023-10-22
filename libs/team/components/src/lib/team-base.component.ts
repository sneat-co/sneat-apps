import {
	Component,
	Inject,
	InjectionToken,
	OnChanges,
	signal,
	SimpleChanges,
} from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { SneatBaseComponent } from '@sneat/ui';

@Component({
	template: '',
})
export abstract class TeamBaseComponent
	extends SneatBaseComponent
	implements OnChanges
{
	protected readonly $team = signal<ITeamContext | undefined>(undefined);

	constructor(
		@Inject(new InjectionToken('className')) className: string,
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
	) {
		super(className, errorLogger);
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['team']) {
			const teamChanges = changes['team'];
			const currTeam = teamChanges.currentValue as ITeamContext | undefined,
				prevTeam = teamChanges.currentValue as ITeamContext | undefined;
			this.$team.set(currTeam);
			if (prevTeam?.id !== currTeam?.id) {
				this.onTeamIdChanged();
			}
		}
	}

	// Override in child if needed
	protected abstract onTeamIdChanged(): void;
}
