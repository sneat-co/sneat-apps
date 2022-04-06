import {IListInfo, IListItemInfo} from '../../../../models/dto/dto-list';
import {ModalController} from '@ionic/angular';
import {Injectable} from '@angular/core';
import {CopyListItemsPageComponent} from './copy-list-items/copy-list-items-page.component';

@Injectable()
export class ListDialogsService {
	constructor(
		private readonly modalCtrl: ModalController,
	) {
	}

	async copyListItems(listItems: IListItemInfo[], from: IListInfo, to?: IListInfo): Promise<void> {
		if (!to) {
			to = {  // TODO: get rid of hardcoded?
				type: 'buy',
				shortId: 'groceries',
				title: 'Groceries',
				commune: {type: 'family', title: 'Family'}
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
		// tslint:disable-next-line:ban-ts-ignore
		// @ts-ignore
		modal.componentProps.modal = modal; // Ionic bug with modal.dismiss() not finding modal

		await modal.present();
	}
}
