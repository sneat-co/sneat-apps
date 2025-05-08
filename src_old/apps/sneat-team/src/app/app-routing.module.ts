import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'folder/Inbox',
		pathMatch: 'full',
	},
	{
		path: 'folder/:id',
		loadComponent: () =>
			import('./folder/folder-page.component').then((m) => m.FolderPageComponent),
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
	],
	exports: [RouterModule],
})
export class AppRoutingModule
{
}
