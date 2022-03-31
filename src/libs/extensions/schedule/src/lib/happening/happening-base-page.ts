//tslint:disable:no-unsafe-any
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {OnInit} from '@angular/core';
import {RxStoreTableService} from 'rxstore';
import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';
import {IHappening} from 'sneat-shared/models/dto/dto-happening';
import {ICommuneDto} from 'sneat-shared/models/dto/dto-commune';
import {RegularHappeningKind, SingleHappeningKind} from 'sneat-shared/models/kinds';
import {HappeningModuleSchema} from '../../../models/db-schemas-by-module';
import {eq} from '../../../services/interfaces';

export abstract class HappeningBasePage extends CommuneBasePage implements OnInit {

	public happeningDto: IHappening;

	protected constructor(
		params: CommuneBasePageParams,
		private readonly happeningService: RxStoreTableService<IHappening,
			HappeningModuleSchema,
			typeof SingleHappeningKind | typeof RegularHappeningKind>,
	) {
		super('schedule', params);
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
			this.route.queryParamMap.subscribe(params => {
				const happeningId = params.get('id');
				if (!happeningId) {
					return;
				}
				this.subscriptions.push(this.happeningService.watchById(happeningId)
					.subscribe(
						happeningDto => {
							if (!happeningDto) {
								return;
							}
							this.setHappeningDto(happeningDto);
							if (!eq(this.communeRealId, happeningDto.communeId)) {
								this.setPageCommuneIds('HappeningBasePage.happeningFromObservable', {real: happeningDto.communeId});
							}
						},
						this.errorLogger.logError,
					));
			});
		}
	}

	protected setHappeningDto(dto: IHappening): void {
		if (!dto) {
			return;
		}
		this.happeningDto = dto;
	}
}
