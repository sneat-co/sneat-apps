import {Component} from '@angular/core';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';

export type HttpMethod = 'DELETE' | 'GET' | 'POST' | 'PUT' | 'PATCH';

export interface IHttpQueryDef {
	method: HttpMethod;
	url: string;
	body?: string;
}

@Component({
	selector: 'datatug-http-query-editor',
	templateUrl: 'http-query-editor.component.html'
})
export class HttpQueryEditorComponent {
	tab = 'headers';
	queryDef: IHttpQueryDef = {
		method: 'GET',
		url: 'https://api.coinbase.com/v2/currencies',

	};

	public get takesBody() {
		return this.queryDef.method === 'POST';
	}

	constructor(
		private readonly httpClient: HttpClient,
	) {
	}

	response: HttpResponse<any>;
	responseTab: 'raw' | 'formatted' | 'structured' | 'headers' = 'raw';

	run(): void {
		let req: HttpRequest<any>;
		switch (this.queryDef.method) {
			case 'GET':
			case 'DELETE':
				req = new HttpRequest(this.queryDef.method, this.queryDef.url);
				break;
			case 'POST':
			case 'PUT':
			case 'PATCH':
				req = new HttpRequest(this.queryDef.method, this.queryDef.url, this.queryDef.body);
		}
		this.httpClient.request(req).subscribe(event => {
			console.log('RESPONSE:', event);
			if (event instanceof HttpResponse) {
				this.response = event;
			}
		});
	}
}
