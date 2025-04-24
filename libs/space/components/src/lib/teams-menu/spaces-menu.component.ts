import {
	ChangeDetectionStrategy,
	Component,
	computed,
	Input,
	signal,
} from '@angular/core';
import {
	IonIcon,
	IonItem,
	IonLabel,
	MenuController,
	NavController,
} from '@ionic/angular/standalone';
import { ISneatUserState, SneatUserService } from '@sneat/auth-core';
import { UserRequiredFieldsService } from '@sneat/auth-ui';
import { SpaceType } from '@sneat/core';
import {
	ISpaceContext,
	spaceContextFromBrief,
	zipMapBriefsWithIDs,
} from '@sneat/space-models';
import { SneatBaseComponent } from '@sneat/ui';
import { SpacesListComponent } from '../teams-list';

@Component({
	selector: 'sneat-spaces-menu',
	templateUrl: './spaces-menu.component.html',
	imports: [SpacesListComponent, IonItem, IonLabel, IonIcon],
	providers: [UserRequiredFieldsService],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpacesMenuComponent extends SneatBaseComponent {
	@Input() spacesLabel = 'Spaces';
	@Input() pathPrefix = '/space';

	@Input() spaceType?: SpaceType;

	protected readonly $userSpaces = signal<ISpaceContext[] | undefined>(
		undefined,
	);

	protected readonly $userID = signal<string>('');

	protected readonly $spacesToShow = computed<ISpaceContext[]>(() => {
		const userSpaces = this.$userSpaces();
		const spaces =
			(this.spaceType
				? userSpaces?.filter((t) => t.type === this.spaceType)
				: userSpaces) || [];
		if (!this.spaceType) {
			const addPseudoSpace = (type: 'family' | 'private'): void => {
				if (!spaces.some((t) => t.type === type)) {
					spaces.push({
						id: '',
						type,
						brief: userSpaces
							? {
									type,
									title: '',
								}
							: undefined, // define brief indicates we have user record loaded
					});
				}
			};
			addPseudoSpace('family');
			addPseudoSpace('private');
		}
		const sortOrder: Record<string, number> = {
			family: 1,
			private: 2,
		};
		spaces.sort((a: ISpaceContext, b: ISpaceContext) => {
			// Determine the sorting priority (lower values mean higher priority)
			const priorityA = (a.type && sortOrder[a.type]) ?? 3; // Default to 3 for all other types
			const priorityB = (b.type && sortOrder[b.type]) ?? 3;

			// Compare priority first
			if (priorityA !== priorityB) {
				return priorityA - priorityB;
			}

			// If same priority, sort by title alphabetically
			return a.brief?.title.localeCompare(b.brief?.title || '') || 0;
		});
		return spaces;
	});

	private onUserStateChanged = (user: ISneatUserState): void => {
		console.log('SpacesMenuComponent.onUserStateChanged', user);
		this.$userID.set(user.user?.uid || '');
		if (!user?.record) {
			this.$userSpaces.set(undefined);
			return;
		}

		this.$userSpaces.set(
			user?.record?.spaces
				? zipMapBriefsWithIDs(user?.record?.spaces).map((t) =>
						spaceContextFromBrief(t.id, t.brief),
					)
				: [],
		);
	};

	protected readonly $familySpace = signal<ISpaceContext | undefined>(
		undefined,
	);

	constructor(
		readonly userService: SneatUserService,
		// private readonly spaceNavService: SpaceNavService,
		private readonly navController: NavController,
		private readonly menuController: MenuController,
	) {
		super('SpacesMenuComponent');
		userService.userState.pipe(this.takeUntilDestroyed()).subscribe({
			next: this.onUserStateChanged,
		});
	}

	protected closeMenu(): void {
		this.menuController
			.close()
			.catch(this.errorLogger.logErrorHandler('Failed to close teams menu'));
	}
}
