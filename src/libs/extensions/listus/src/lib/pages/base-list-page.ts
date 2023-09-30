//tslint:disable:no-unsafe-any
import { ActivatedRoute, ParamMap } from "@angular/router";
import { emptyTimestamp, IListBrief, IListDto, IMovie, ListType } from "@sneat/dto";
import { TeamItemBaseComponent } from "@sneat/team/components";
import { IListContext, ITeamContext } from "@sneat/team/models";
import { Observable, Subscription, throwError } from "rxjs";
import { tap } from "rxjs/operators";
import { ListusComponentBaseParams } from "../listus-component-base-params";

export abstract class BaseListPage extends TeamItemBaseComponent<IListBrief, IListDto> {

	public list?: IListContext;
	public listGroupTitle?: string;
	protected listSubscription?: Subscription;

	protected constructor(
		className: string,
		// defaultBackPage: DefaultBackPage,
		route: ActivatedRoute,
		protected readonly params: ListusComponentBaseParams
	) {
		super(className, route, params.teamParams, "lists", "list", params.listService);
	}

	protected override watchItemChanges(): Observable<IListContext> {
		if (!this.team) {
			return throwError(() => new Error("no team context"));
		}
		if (!this.list) {
			return throwError(() => new Error("no list context"));
		}
		if (!this.list.type) {
			return throwError(() => new Error("no list type context"));
		}
		return this.listService.watchList(this.team, this.list.type, this.list.id);
	}

	protected override setItemContext(item?: IListContext): void {
		console.log("BaseListPage.setItemContext()", item);
		super.setItemContext(item);
		this.list = item;
	}

	protected override briefs(): Readonly<{ [id: string]: IListBrief }> | undefined {
		throw new Error("not implemented due to refactoring");
		// const briefs: IListBrief[] = [];
		// this.team?.dto?.listGroups?.forEach(lg => {
		// 	lg.lists?.forEach(l => briefs.push({id: l.id}));
		// });
		// return briefs;
	}

	public get listService() {
		return this.params.listService;
	}

	public setList(list: IListContext): void {
		console.log("BaseListPage.setList()", list, "this.list:", this.list);
		if (!list.brief && list.id == this.list?.id && this.list.brief) {
			list = { ...list, brief: this.list.brief };
			console.log("BaseListPage.setList() => new this.list:", list);
		}
		this.list = list;
	}

	goMoviePage(movie: IMovie): void {
		console.log("goMoviePage", movie);
		if (!this.list) {
			this.errorLogger.logError("not able to navigate without list context");
		}
		if (!this.team) {
			this.errorLogger.logError("not able to navigate without team context");
			return;
		}
		const url = `space/${this.team.id}`;
		this.teamParams.teamNavService.navigateForwardToTeamPage(this.team,
			url,
			{
				state: {
					list: this.list,
					listItem: movie
				}
			}
		).catch(this.errorLogger.logError);
	}

	protected subscribeForListChanges(team: ITeamContext, listType: ListType, listID: string): void {
		console.log(`BaseListPage.subscribeForListChanges(${team.id}, ${listType}, ${listID})`);
		if (this.listSubscription) {
			this.errorLogger.logError("got duplicate attempt to subscribe to list changes");
			return;
		}
		this.listService.watchList(team, listType, listID).pipe(
			this.takeUntilNeeded()
		)
			.pipe(
				tap(list => console.log("BaseListPage.subscribeForListChanges() =>", list))
			)
			.subscribe({
				next: list => this.setList(list),
				error: this.errorLogger.logErrorHandler("failed to load list")
			});
	}

	protected override onRouteParamsChanged(params: ParamMap) {
		const
			id = params.get("listID"),
			type = params.get("listType"),
			teamID = params.get("teamID") || this.team?.id;
		if (!id) {
			this.listSubscription?.unsubscribe();
			this.listSubscription = undefined;
			return;
		}
		if (this.list?.id == id) {
			return;
		}
		this.listSubscription?.unsubscribe();
		this.listSubscription = undefined;
		const title = id.charAt(0).toUpperCase() + id.slice(1);
		if (!teamID) {
			throw new Error("no team context");
		}
		const team = { id: teamID };
		this.setList({ id, brief: { createdAt: emptyTimestamp, createdBy: "", type: type as ListType, title }, team });

		if (!this.list?.brief?.type) {
			throw new Error("unknown list type");
		}
		this.subscribeForListChanges(team, this.list.brief.type, id);
	}
}
