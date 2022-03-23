import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	CanLoad,
	Route,
	Router,
	RouterStateSnapshot,
	UrlSegment,
	UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, take } from 'rxjs/operators';
import { AuthPipe } from '@angular/fire/compat/auth-guard';

type AuthCanLoadPipeGenerator = (
	route: Route,
	segments: UrlSegment[],
) => AuthPipe;

export const redirectToLoginIfNotSignedIn: AuthPipe = map((user) => {
	if (user) {
		return true;
	}
	let url = '/login';
	if (location.pathname != '/') {
		url += '#' + location.pathname;
	}
	return url;
});

@Injectable()
export class SneatAuthGuard implements CanLoad, CanActivate, CanActivateChild {
	constructor(
		private readonly router: Router,
		private readonly auth: AngularFireAuth,
	) {
	}

	public canLoad(
		route: Route,
		segments: UrlSegment[],
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		{
			console.log('SneatAuthGuard.canLoad', route, segments);
			const authPipeFactory =
				(route.data && route.data['authCanLoadGuardPipe'] as AuthCanLoadPipeGenerator) ||
				(() => redirectToLoginIfNotSignedIn);
			return this.auth.user.pipe(
				map((user) => {
					console.log('user', user);
					return user;
				}),
				take(1),
				authPipeFactory(route, segments),
				map((can) => {
					console.log('can', can);
					if (typeof can === 'boolean') {
						return can;
					} else if (Array.isArray(can)) {
						return this.router.createUrlTree(can);
					} else {
						return this.router.parseUrl(can);
					}
				}),
			);
			// return true;
		}
	}

	public canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot, //: Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
	) {
		console.log('SneatAuthGuard.canActivate', route, state);
		return true;
	}

	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot, // : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
	) {
		console.log('SneatAuthGuard.canActivateChild', childRoute, state);
		return true;
	}
}

export const canLoad = (pipe?: AuthCanLoadPipeGenerator) => ({
	canLoad: [SneatAuthGuard],
	data: { authCanLoadGuardPipe: pipe },
});

export const SNEAT_AUTH_GUARDS = {
	canActivate: [SneatAuthGuard],
	canLoad: [SneatAuthGuard],
};
