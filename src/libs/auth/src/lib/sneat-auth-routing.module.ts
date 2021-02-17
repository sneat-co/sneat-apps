// import {NgModule} from '@angular/core';
// import {RouterModule, Routes} from '@angular/router';
// import {LoginPage} from '../../../../auth/src/lib/auth-ui/login/login.page';
// import {LoginPageModule} from '../../../../auth/src/lib/auth-ui/login/login.module';
//
// const routes: Routes = [
// 	{
// 		path: 'login',
// 		component: LoginPage,
// 		// loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
// 	},
// ];
//
// export const SneatAuthRoutingModule: NgModule = {
// 	imports: [
// 		LoginPageModule,
// 		RouterModule.forChild(routes),
// 	],
// 	exports: [RouterModule],
// };
//
// /* Example of usage:
//
// @NgModule({
// 	imports: [
// 		...SneatAuthRoutingModule.imports,
// 		RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy'})
// 	],
// 	exports: [RouterModule],
// 	providers: [
// 		sneatUiCoreProviders,
// 	],
// })
// export class AppRoutingModule {
// }
//
//  */
