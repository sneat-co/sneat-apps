import { Injectable, Type } from '@angular/core';

export type PreloadPages =
	| 'assets'
	| 'contacts'
	| 'members'
	| 'real-estates'
	| 'budget'
	;

@Injectable({
	providedIn: 'root',
})
export class NgModulePreloaderService {

	private readonly preloaded: string[] = [];

	/*
		 'applicants': './pages/commune/contact/contacts/commune-contacts.page.module#CommuneContactsPageModule',
		 'assets': './pages/commune/asset/assets/assets.module#AssetsPageModule',
		 'commune-overview': './pages/commune/overview/commune-overview.module#CommuneOverviewPageModule',
		 'bills': '',
		 'budget': './pages/commune/budget/budget.module#BudgetPageModule',
		 'staff': './pages/commune/members/staff/staff.module#StaffPageModule',
		 'member': './pages/commune/member/member/commune-member.module#CommuneMemberPageModule',
		 'member-new': './pages/commune/member/member-new/member-new.module#MemberNewPageModule',
		 'members': './pages/commune/members/members/commune-members.module#CommuneMembersPageModule',
		 'group': './pages/commune/member-group/member-group/member-group.module#MemberGrpupPageModule',
		 'group-new': './pages/commune/member-group/member-group-new/member-group-new.module#MemberGroupNewPageModule',
		 'groups': './pages/commune/member-group/member-groups/member-groups.module#MemberGroupsPageModule',
		 'contact': './pages/commune/contact/contact/commune-contact.module#CommuneContactPageModule',
		 'contact-new': './pages/commune/contact/contact-new/contact-new.module#ContactNewPageModule',
		 'contacts': './pages/commune/contact/contacts/commune-contacts.page.module#CommuneContactsPageModule',
		 'document': './pages/commune/document/document/commune-document.module#CommuneDocumentPageModule',
		 'document-new': './pages/commune/document/document-new/document-new.module#DocumentNewPageModule',
		 'documents': './pages/commune/document/documents/commune-documents.module#CommuneDocumentsPageModule',
		 'landlords': './pages/commune/contact/contacts/commune-contacts.page.module#CommuneContactsPageModule',
		 'lists': './shared/listus/commune/list/lists/lists.module#ListsPageModule',
		 'pupils': './pages/commune/members/pupils/pupils.module#PupilsPageModule',
		 'real-estates': './pages/commune/asset/real-estate/real-estate.module#RealEstatePageModule',
		 'schedule': './pages/commune/schedule/schedule/schedule-page.module#SchedulePageModule',
		 'tenants': './pages/commune/contact/contacts/commune-contacts.page.module#CommuneContactsPageModule',
		 'terms': './pages/commune/term/terms/terms.module#TermsPageModule',
		 'tasks': './pages/commune/todo/tasks/tasks-page.module#TasksPageModule',
	 */
	private readonly configs: { [id: string]: { path: string; type: Type<unknown> } } = {}; // Use addPreloadConfigs

	private warned = false;

	/*
		* https://blog.angularindepth.com/as-busy-as-a-bee-lazy-loading-in-the-angular-cli-d2812141637f
		* https://blog.angularindepth.com/here-is-what-you-need-to-know-about-dynamic-components-in-angular-ac1e96167f9e
		 */
	// constructor(
	// 	// private readonly injector: Injector,
	// 	// private loader: NgModuleFactoryLoader,
	// ) {
	// }

	public addPreloadConfigs(...configs: { id: string; path: string; type: Type<unknown>; module?: string }[]): void {
		configs.forEach(config => {
			this.configs[config.id] = { path: config.path, type: config.type };
		});
	}

	public markAsPreloaded(path: string): void {
		this.preloaded.push(path);
	}

	public preload(paths: string[], ms = 1000): void {
		if (!this.warned) {
			this.warned = true;
			console.warn(`Preloading is disabled until migrated to Ivy (delay=${ms}ms)`);
		}
		return; // TODO: Enable preloading once migrated to Angular Ivy
		// setTimeout(
		// 	() => {
		// 		paths = paths.filter(p => this.preloaded.indexOf(p) < 0);
		// 		if (!paths.length) {
		// 			return;
		// 		}
		// 		console.log('preloading:', paths);
		// 		paths.forEach(p => {
		// 			if (this.preloaded.indexOf(p) >= 0) {
		// 				return;
		// 			}
		// 			const config = this.configs[p];
		// 			if (!config) {
		// 				console.error('Unknown preload id:', p);
		// 				return;
		// 			}
		// 				this.loader.load(config.path)
		// 					.then((factory) => {
		// 						console.log('preloaded:', factory);
		// 						this.preloaded.push(p);
		// 						if (config.type) {
		// 							try {
		// 								const module = factory.create(this.injector);
		// 								const cf = module.componentFactoryResolver.resolveComponentFactory(config.type);
		// 								const cr = cf.create(this.injector);
		// 								cr.destroy();
		// 							} catch (e) {
		// 								console.error(`Failed to create or destroy preloaded component ${config.path}:`, e);
		// 							}
		// 						}
		// 					})
		// 					.catch(err => {
		// 						console.error('Failed to preload NG module:', err);
		// 					});
		// 		});
		// 	},
		// 	ms,
		// );
	}
}
