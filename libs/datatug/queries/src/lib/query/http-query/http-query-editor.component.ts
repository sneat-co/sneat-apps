import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DatatugComponentsJsontugModule } from '@sneat/ext-datatug-components-jsontug';
import { currencyFlag, LookupPipe } from '@sneat/ext-datatug-plugins';

export type HttpMethod = 'DELETE' | 'GET' | 'POST' | 'PUT' | 'PATCH';

export interface IHttpQueryDef {
	method: HttpMethod;
	url: string;
	body?: string;
}

export interface IHttpApiEndpoint {
	url: string;
	title: string;
}

@Component({
	selector: 'sneat-datatug-http-query-editor',
	templateUrl: 'http-query-editor.component.html',
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DatatugComponentsJsontugModule,
	],
})
export class HttpQueryEditorComponent {
	protected tab = 'headers';
	protected queryDef: IHttpQueryDef = {
		method: 'GET',
		url: 'https://api.coinbase.com/v2/currencies',
	};

	public get takesBody() {
		return this.queryDef.method === 'POST';
	}

	readonly apiEndpoints: IHttpApiEndpoint[] = [
		{
			url: 'https://api.coinbase.com/v2/currencies',
			title: 'Currency codes and names',
		},
		{
			url: 'https://api.coingecko.com/api/v3/exchange_rates',
			title: 'Exchange rates',
		},
	];

	constructor(private readonly httpClient: HttpClient) {}

	public readonly currencyPipe = new LookupPipe(
		currencyFlag,
		'data.#',
		'id',
		'currency_flag',
	);

	isCurrencyPipeEnabled = false;

	// pipes: IObjectPipe[] = [];

	response?: HttpResponse<unknown>;
	responseTab: 'raw' | 'formatted' | 'structured' | 'headers' = 'raw';

	run(): void {
		let req: HttpRequest<unknown>;
		const { method, url } = this.queryDef;
		switch (method) {
			case 'GET':
				req = new HttpRequest(method, url);
				break;
			case 'DELETE':
				req = new HttpRequest(method, url);
				break;
			case 'POST':
			case 'PUT':
			case 'PATCH':
				req = new HttpRequest(method, url, this.queryDef.body);
		}
		this.httpClient.request(req).subscribe((event) => {
			console.log('RESPONSE:', event);
			if (event instanceof HttpResponse) {
				this.response = event;
			}
		});
	}

	public try(event: Event, endpoint: IHttpApiEndpoint): void {
		event.preventDefault();
		event.stopPropagation();
		this.queryDef = { ...this.queryDef, url: endpoint.url };
		this.run();
	}
}
