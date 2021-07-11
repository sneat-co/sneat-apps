import {Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {DatatugFoldersService} from '@sneat/datatug/folders';
import {IProjectRef} from '@sneat/datatug/core';
import {takeUntil} from 'rxjs/operators';
import {folderItemsAsList, IFolder, IProjItemBrief, ProjectItem} from '@sneat/datatug/models';

@Component({
	selector: 'datatug-folder',
	templateUrl: 'datatug-folder.component.html',
})
export class DatatugFolderComponent implements OnChanges, OnDestroy {

	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly Environment = ProjectItem.Environment as const;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly Board = ProjectItem.Board as const;

	private destroyed = new Subject<void>();

	items?: IProjItemBrief[];

	@Input() path = '~';
	@Input() projectRef?: IProjectRef;

	tab: 'boards' | 'queries' | 'environments' | 'entities' = 'boards'

	public folder?: IFolder | null;

	public getItemLink = (path: string) => (item: IProjItemBrief) => `${path}/${item.id}`;

	constructor(
		private readonly foldersService: DatatugFoldersService,
	) {
		// foldersService.watchFolder()
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.projectRef) {
			this.subscribeForFolder();
		}
	}

	private subscribeForFolder(): void {
		if (this.projectRef) {
			this.foldersService.watchFolder({...this.projectRef, id: this.path})
				.pipe(takeUntil(this.destroyed))
				.subscribe({
					next: folder => {
						this.folder = folder;
						this.items = folder?.boards ? folderItemsAsList(folder.boards).map(v => ({
							id: v.id,
							title: v.name
						})) : [];
						console.log('DatatugFolderComponent => folder:', folder);
					}
				});
		}
	}
}
