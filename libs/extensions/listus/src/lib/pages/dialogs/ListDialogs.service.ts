import { Injectable, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IListInfo, IListItemBrief } from '../../dto';
import { CopyListItemsPageComponent } from './copy-list-items/copy-list-items-page.component';

@Injectable()
export class ListDialogsService {
	private readonly modalCtrl = inject(ModalController);

	async copyListItems(
		listItems: IListItemBrief[],
		from: IListInfo,
		to?: IListInfo,
	): Promise<void> {
		if (!to) {
			to = {
				// TODO: get rid of hardcoded?
				type: 'buy',
				emoji: '🛒',
				shortId: 'groceries',
				title: 'Groceries',
				space: { type: 'family', title: 'Family' },
			};
		}

		const modal = await this.modalCtrl.create({
			component: CopyListItemsPageComponent,
			componentProps: {
				from,
				to,
				listItems,
			},
		});
		if (modal.componentProps) {
			modal.componentProps['modal'] = modal; // Ionic bug with modal.dismiss() not finding modal
		}

		await modal.present();
	}
}
