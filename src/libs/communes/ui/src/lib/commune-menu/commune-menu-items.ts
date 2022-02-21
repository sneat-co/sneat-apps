import { CommuneMenuItem } from "./commune-menu-item";
import { CommuneTopPage } from "../constants";
import { NgModulePreloaderService } from "@sneat/core";
import { Commune } from "../models/ui/ui-models";

export function getMenuItems(commune: Commune, showExperimental: boolean, preloader: NgModulePreloaderService, preloaderDelay: number = 0)
	: CommuneMenuItem[] {
	const type = commune.type;
	// showExperimental = showExperimental || type === 'realtor';
	const menuItems = allCommuneMenuItems.filter(menuItem => {
			if (menuItem.experimental && !showExperimental) {
				return false;
			}
			if (menuItem.communeSupports && !commune.supports(menuItem.communeSupports)) {
				return false;
			}
			if (menuItem.excludeCommuneType && menuItem.excludeCommuneType.includes(type)) {
				return false;
			}
			// noinspection RedundantIfStatementJS
			if (menuItem.communeTypes && !menuItem.communeTypes.includes(type)) {
				return false;
			}
			return true;
		}
	);
	preloader.preload(menuItems.map(menuItem => menuItem.preload || menuItem.code), preloaderDelay);
	return menuItems;
}

const allCommuneMenuItems: CommuneMenuItem[] = [
	{
		code: CommuneTopPage.assets,
		defaultEmoji: "🏡",
		defaultTitle: "Assets",
		counter: "assets",
		newDefaultTitle: "New asset",
		pages: { main: "assets", new: "new-asset" },
		excludeCommuneType: ["realtor", "educator"],
	},
	{
		code: "real-estates",
		defaultEmoji: "🏡",
		defaultTitle: "Properties",
		counter: "assets",
		newDefaultTitle: "New property",
		pages: { main: "real-estates", new: "new-asset" },
		communeTypes: ["realtor"],
	},
	{
		code: CommuneTopPage.budget,
		defaultEmoji: "⚖️",
		defaultTitle: "Budget",
		pages: { main: "budget" },
		excludeCommuneType: ["educator"],
	},
	{
		code: CommuneTopPage.bills,
		defaultEmoji: "💸",
		defaultTitle: "Bills",
		// experimental: true,
		pages: { main: "budget" },
		communeTypes: ["cohabit"],
		preload: "budget",
	},
	{
		code: CommuneTopPage.contacts,
		defaultEmoji: "📇",
		defaultTitle: "Contacts",
		counter: "contacts",
		newDefaultTitle: "New contact",
		pages: { main: "contacts", new: "new-contact" },
		excludeCommuneType: ["realtor"],
	},
	{
		code: CommuneTopPage.landlords,
		defaultEmoji: "🤴",
		defaultTitle: "Landlords",
		newDefaultTitle: "New landlord",
		pages: { main: "landlords" },
		communeTypes: ["realtor"],
	},
	{
		code: CommuneTopPage.tenants,
		communeTypes: ["realtor"],
		defaultEmoji: "🤠",
		defaultTitle: "Tenants",
		newDefaultTitle: "New tenant",
		pages: { main: "tenants" },
	},
	{
		code: CommuneTopPage.applicants,
		communeTypes: ["realtor"],
		defaultEmoji: "🤔",
		defaultTitle: "Applicants",
		newDefaultTitle: "New applicant",
		pages: { main: "applicants", new: "new-contact" },
	},
	//
	{
		code: CommuneTopPage.documents,
		communeTypes: ["family"],
		counter: "documents",
		defaultEmoji: "📃",
		defaultTitle: "Documents",
		newDefaultTitle: "New document ",
		pages: { main: "documents", new: "new-document" },
	},
	// {
	//     code: 'health',
	//     defaultEmoji: '💊',
	//     defaultTitle: "Health",
	//     experimental: true,
	//     pages: {main: undefined},
	//     isNotImplementedYet: true,
	// },
	{
		code: CommuneTopPage.lists,
		defaultEmoji: "📜",
		defaultTitle: "Lists",
		pages: { main: "lists" },
		communeTypes: ["family", "cohabit", "personal"],
	},
	{
		code: CommuneTopPage.sizes,
		defaultEmoji: "📏",
		defaultTitle: "Sizes",
		pages: { main: "sizes" },
		communeTypes: ["family", "cohabit", "personal"],
	},
	{
		code: CommuneTopPage.members,
		defaultEmoji: "👪",
		defaultTitle: "Members",
		counter: "members",
		newDefaultTitle: "New member",
		pages: { main: "members", new: "new-member" },
		excludeCommuneType: ["educator", "realtor", "personal"],
	},
	{
		code: CommuneTopPage.groups,
		communeTypes: ["educator"],
		counter: "memberGroups",
		defaultEmoji: "👪",
		defaultTitle: "Groups",
		newDefaultTitle: "New group",
		pages: { main: "groups", new: "new-group" },
	},
	{
		code: CommuneTopPage.pupils,
		communeTypes: ["educator"],
		counter: "pupils",
		defaultEmoji: "🎓",
		defaultTitle: "Pupils",
		newDefaultTitle: "New member",
		pages: { main: "pupils", new: "new-member" },
	},
	{
		code: CommuneTopPage.staff,
		communeTypes: ["educator", "realtor"],
		counter: "staff",
		byCommuneType: {
			realtor: { emoji: "👨‍💼" },
			educator: { emoji: "👩‍🏫" },
		},
		defaultTitle: "Staff",
		newDefaultTitle: "New staff",
		pages: { main: "staff", new: "new-member" },
	},
	{
		code: CommuneTopPage.schedule,
		defaultEmoji: "📅",
		defaultTitle: "Schedule",
		newDefaultTitle: "New activity",
		pages: { main: "schedule", new: "new-activity" },
	},
	{
		code: CommuneTopPage.terms,
		defaultEmoji: "🎬",
		defaultTitle: "Terms",
		newDefaultTitle: "New term",
		pages: { main: "terms", new: "new-term" },
		communeTypes: ["educator"],
	},
	{
		code: CommuneTopPage.tasks,
		defaultEmoji: "🔔",
		defaultTitle: "Tasks",
		newDefaultTitle: "New task",
		pages: { main: "tasks", new: "new-task" },
		communeTypes: ["family", "personal", "realtor"],
		experimental: true,
	},
];
