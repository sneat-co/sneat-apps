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
		const happening = window.history.state.happening as unknown as IHappeningContext;
		if (happening) {
			this.setHappening(happening);
		}
		this.trackUrl();
	}

	protected readonly setHappening = (happening?: IHappeningContext): void => {
		console.log(`${this.className}.setHappening()`, happening);
		this.happening = happening;
	}

	private trackUrl(): void {
		this.route?.params.subscribe(params => {
			// const happeningId = params.get('id');
			// if (!happeningId) {
			// 	return;
			// }
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
