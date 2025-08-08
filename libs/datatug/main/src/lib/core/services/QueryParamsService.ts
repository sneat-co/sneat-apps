import { Injectable, inject } from '@angular/core';

@Injectable()
export class QueryParamsService {
	private readonly location = inject(Location);

	public setQueryParameter(
		name: string,
		value: string | number | boolean,
	): void {
		let url = this.location.href;
		console.log('setQueryParameter', name, value);
		if (url.includes(name + '=')) {
			const re = new RegExp(name + '=.+?(?:&|$)', 'g');
			url = url.replace(re, name + '=' + value);
		} else {
			url += (url.includes('?') ? '&' : '?') + name + '=' + value;
		}
		// this.navController.navigateForward(url, {replaceUrl: true})
		// 	.catch(err => {
		// 		this.errorLogger.logError(err, `failed: ${err}`) ;
		// 	});
		// this.router.navigateByUrl(url);

		history.replaceState(undefined, document.title, url);
	}
}
