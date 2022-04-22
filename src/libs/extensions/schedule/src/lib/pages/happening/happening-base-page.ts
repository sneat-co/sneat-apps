import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IHappeningContext } from '@sneat/team/models';

export abstract class HappeningBasePage extends TeamBaseComponent {

	public happening?: IHappeningContext;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		// private readonly happeningService: RxStoreTableService<IHappening,
		// 	HappeningModuleSchema,
		// 	typeof SingleHappeningKind | typeof RegularHappeningKind>,
	) {
		super(className, route, params);
		this.setHappening(window.history.state.happeningDto as unknown as IHappeningContext);
		this.trackUrl();
	}

	protected setHappening(happening?: IHappeningContext): void {
		this.happening = happening;
	}

	private trackUrl(): void {
		this.route?.queryParamMap.subscribe(params => {
			const happeningId = params.get('id');
			if (!happeningId) {
				return;
			}
			// this.happeningService.watchById(happeningId)
			// 	.pipe(
			// 		// takeUntil(this.destroyed),
			// 	)
			// 	.subscribe(
			// 		happeningDto => {
			// 			if (!happeningDto) {
			// 				return;
			// 			}
			// 			this.setHappeningDto(happeningDto);
			// 			if (!eq(this.communeRealId, happeningDto.communeId)) {
			// 				this.setPageCommuneIds('HappeningBasePage.happeningFromObservable', { real: happeningDto.communeId });
			// 			}
			// 		},
			// 		this.errorLogger.logError,
			// 	);
		});
	}
}
