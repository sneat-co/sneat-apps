import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {CodemirrorComponent} from '@ctrl/ngx-codemirror';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {
	IProjItemBrief,
	IQueryDef,
	IQueryFolder,
	IQueryFolderContext,
	ISqlQueryRequest,
	QueryItem
} from '@sneat/datatug/models';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {DatatugNavContextService, DatatugNavService} from '@sneat/datatug/services/nav';
import {ViewDidEnter, ViewDidLeave, ViewWillEnter} from "@ionic/angular";
import {getStoreId, IProjectContext} from "@sneat/datatug/nav";
import {QueriesService} from "../queries.service";


@Component({
	selector: 'datatug-sql-queries',
	templateUrl: './queries-page.component.html',
	styleUrls: ['./queries-page.component.scss'],
})
export class QueriesPageComponent implements OnInit, ViewWillEnter, ViewDidEnter, ViewDidLeave {

	@ViewChild('codemirrorComponent', {static: true}) public codemirrorComponent: CodemirrorComponent;

	public isActiveView: boolean;

	// noinspection SqlDialectInspection
	public sql = 'select * from ';

	public tab: 'shared' | 'active' | 'popular' | 'recent' | 'bookmarked' = 'shared'

	public filter = '';

	public project: IProjectContext;

	public get defaultBackHref(): string {
		return this.project ? `/store/${getStoreId(this.project.ref.storeId)}/project/${this.project.ref.projectId}` : '/';
	}


	ionViewWillEnter(): void {
		console.log('ionViewWillEnter()')
		this.isActiveView = true;
	}

	ionViewDidEnter(): void {
		console.log('ionViewDidEnter()')
	}

	ionViewDidLeave(): void {
		console.log('ionViewDidLeave()')
		this.isActiveView = false;
	}

	ngOnInit(): void {
		console.log('QueriesPage.ngOnInit()')
	}

	reloadQueries(): void {
		// this.loadQueries();
	}
}
