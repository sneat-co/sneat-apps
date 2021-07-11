import {Component} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';

export type HttpMethod = 'DELETE' | 'GET' | 'POST' | 'PUT';

export interface IHttpQueryDef {
	method: HttpMethod;
	url: string;
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

	response: any;
	responseTab: 'raw' | 'formatted' | 'structured' = 'raw';

	run(): void {

		let req: HttpRequest<any>;
		if (this.queryDef.method === 'GET') {
			req =  new HttpRequest<any>(this.queryDef.method, this.queryDef.url);
		} else  {
			req =  new HttpRequest<any>(this.queryDef.method, this.queryDef.url, 'test');
		}
		this.httpClient.request(req).subscribe(response => {
			console.log('RESPONSE:', response);
			this.response = response;
		});
	}
}
