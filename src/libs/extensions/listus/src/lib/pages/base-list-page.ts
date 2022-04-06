//tslint:disable:no-unsafe-any
import { ActivatedRoute } from '@angular/router';
import { IListDto, IListInfo } from '@sneat/dto';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import {shortCommuneAndListIds} from '../services/list.service';
import {OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {IListService} from '../services/interfaces';
import {getListUrlId} from './helpers';

export abstract class BaseListPage extends TeamBaseComponent implements OnInit {

	protected loadingListId: string | undefined;
	protected loadListSubscription: Subscription | undefined;

	public listId?: string;
	public shortListId?: string;
	public listInfo?: IListInfo;
	public listDto?: IListDto;
	public listGroupTitle?: string;

	protected constructor(
		className: string,
		private readonly idParamName: 'id' | 'list',
		// defaultBackPage: DefaultBackPage,
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		protected listService: IListService,
	) {
		super(className, route, params);
	}

	ngOnInit(): void {
		super.ngOnInit();
		try {
			this.setListInfoFromHistoryState('BaseListPage.constructor');
			this.route.paramMap.subscribe(params => {
				const id = params.get('id');
				if (!!id) {
					const newUrl = location.href.replace(`/${id}`, `?${this.idParamName}=${id}`);
					console.log(`rewriting url from ${location.href} to ${newUrl}`);
					history.replaceState(undefined, document.title, newUrl);
					this.setListId(id);
				}
			});
			this.subscriptions.push(this.route.queryParamMap.subscribe(p => {
				console.log('BaseListPage.ngOnInit() => route.queryParamMap =>', p);
				const id = p.get('id') || p.get('list') || p.get('folder');
				if (id) {
					this.setListId(id);
				}
			}));
		} catch (e) {
			console.error('BaseListPage.ngOnInit():', e);
		}
	}

	protected onCommuneChanged(source?: string): void {
		if (!this.commune) {
			throw new Error('!this.commune');
		}
		try {
			super.onCommuneChanged(source);

			console.log('BaseListPage.onCommuneChanged => this.listDto:', this.listDto);

			if (!!this.listDto) {
				return;
			}
			const listInfo = this.shortListId
				? CommuneModel.getListInfoByShortId(this.commune.dto, this.shortListId)
				: this.listId ? CommuneModel.getListInfoByRealId(this.commune.dto, this.listId)
					: this.listInfo;

			if (listInfo) {
				this.setListInfo(listInfo);
			}
		} catch (e) {
			this.errorLogger.logError(e);
		}
	}

	protected setListInfo(listInfo: IListInfo): void {
		if (!this.listInfo || listInfo.id && this.listInfo.id !== listInfo.id) {
			this.listInfo = listInfo;
		}
		if (listInfo.id) {
			if (!eq(listInfo.id, this.loadingListId)) {
				this.loadList(listInfo.id);
			}

			return;  // <=================  returns if real list
		}
	}


	private setListId(id: string): void {
		if (id.indexOf('-') > 0 && this.listId) {
			return;
		}
		this.listId = id;
		const {shortCommuneId, shortListId} = shortCommuneAndListIds(id);
		console.log(`BaseListPage.setListId(${id}): shortCommuneId=${shortCommuneId}, shotListId=${shortListId}`);
		if (shortCommuneId && !this.communeShortId) {
			this.shortListId = shortListId;
			this.setPageCommuneIds('loadList', {
				real: shortCommuneId === 'personal' ? getUserPersonalCommuneId(this.authStateService.authState.currentUserId) : undefined,
				short: shortCommuneId,
			});
			return;
		}
		this.onListIdChanged(id);
	}

	protected onListIdChanged(id: string): void {
		if (id.indexOf('-') < 0 && !this.listDto || this.listDto && this.listDto.id !== id) {
			this.loadList(id);
		}
	}

	private setListInfoFromHistoryState(source: string): void {
		if (this.listInfo) {
			return;
		}
		this.listInfo = window.history.state.listInfo as IListInfo;
		if (this.listInfo && this.listInfo.shortId) {
			this.shortListId = this.listInfo.shortId;
		}
		console.log(`BaseListPage.setListInfoFromHistoryState(source=${source})`, this.listInfo);
		this.listGroupTitle = window.history.state.listGroupTitle;
		this.shortCommuneInfo = window.history.state.shortCommuneInfo;
		if (this.shortCommuneInfo) {
			this.communeShortId = this.shortCommuneInfo.shortId || '';
			if (this.listInfo) {
				this.listInfo.commune = this.shortCommuneInfo;
			}
		}
		const listDto = window.history.state.listDto as IListDto;
		if (listDto) {
			this.setListDto(listDto);
		}
		this.onListInfoChanged();
	}

	protected onListInfoChanged(): void {
		console.log('BaseListPage.onListInfoChanged()', this.listInfo);
	}

	protected loadList(id: string): void {
		console.log('BaseListPage.loadList', id);
		if (id.indexOf('-') > 0 || id === this.loadingListId || this.listDto && this.listDto.id === id) {
			return;
		}
		if (this.loadingListId && this.loadingListId !== id && this.loadListSubscription) {
			this.loadListSubscription.unsubscribe();
		}
		if (!id) {
			throw new Error('!id');
		}
		this.processList$(id, this.listService.mustGetById(id));
	}

	protected processList$(id: string, list$: Observable<IListDto>): void {
		console.log('processList$', id, list$);
		this.loadingListId = id;
		this.loadListSubscription = list$.subscribe({
			next: list => {
				console.log('BaseListPage.processList$() => loaded:', list);
				this.setListDto(list);
			},
			error: err => {
				this.errorLogger.logError(err, 'Failed to load list');
			},
			complete: () => {
				console.log('processList$ => completed');
				this.loadingListId = undefined;
				this.loadListSubscription = undefined;
			}
		});
	}

	public setListDto(listDto: IListDto): void {
		console.log('BaseListPage.setListDto()', listDto);
		this.listDto = listDto;
		try {
			if (!eq(listDto.communeId, this.communeRealId)) {
				this.setPageCommuneIds('BaseListPage.DtoList', {
					real: listDto.communeId, short: this.communeShortId
				});
			}

			this.listInfo = createListInfoFromDto(listDto, this.shortListId);
			this.listInfo.commune = this.shortCommuneInfo;
		} catch (e) {
			this.errorLogger.logError(e);
		}
	}

	goMoviePage(movie: IMovie): void {
		console.log('goMoviePage', movie, 'listDto', this.listDto, 'listInfo', this.listInfo);
		const listInfo = this.listInfo;
		if (!listInfo) {
			throw new Error('!this.listInfo');
		}
		// tslint:disable-next-line:no-any
		const queryParams: any = {
			list: getListUrlId(listInfo),
		};
		if (movie.id) {
			queryParams.item = movie.id;
			console.log(movie.id);
		} else {
			queryParams.idTmdb = movie.idTmdb;
		}
		if (!this.commune) {
			throw new Error('!this.commune');
		}
		this.navigateForward(
			'movie-info',
			queryParams,
			{
				listInfo: this.listInfo,
				shortCommuneInfo: createShortCommuneInfoFromDto(this.commune.dto, this.commune.shortId),
				listItemInfo: movie,
			},
			{
				excludeCommuneId: true,
			},
		);
	}
}
