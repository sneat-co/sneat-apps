import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IHappeningContext } from '@sneat/team/models';

export abstract class HappeningBasePage extends TeamBaseComponent implements OnInit {

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
	}

	ngOnInit(): void {
		super.ngOnInit();
		this.setHappeningDto(window.history.state.happeningDto as unknown as IHappening);
		if (this.happeningDto) {
			if (!eq(this.happeningDto.communeId, this.communeRealId)) {
				this.setPageCommuneIds(
					'HappeningBasePage.ngOnInit',
					{
						real: this.happeningDto.communeId,
					},
					window.history.state.communeDto as ICommuneDto);
			}
		} else {
			this.trackUrl();
		}
	}

	protected setHappeningDto(happening?: IHappeningContext): void {
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
