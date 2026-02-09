import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
// import { Period } from 'sneat-shared/models/types';
// import { DtoLiability } from 'sneat-shared/models/dto/dto-liability';
// import { Asset } from 'sneat-shared/models/ui/ui-asset';
// import { IAssetService, IErrorLogger } from 'sneat-shared/services/interfaces';
// import { IRecord, RxRecordKey } from 'rxstore';

const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

@Component({
	selector: 'sneat-month',
	templateUrl: './month-page.component.html',
	styleUrls: ['./month-page.component.scss'],
	imports: [
		FormsModule,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonButtons,
		IonButton,
		IonIcon,
		IonContent,
	],
})
export class MonthPageComponent {
	public segment: 'expense' | 'income' | 'balance' = 'expense';
	// public period: Period = 'month';
	public current: 'This' | 'Next' | 'Previous' = 'This';
	public balance?: number;

	public expandedAssetId?: string;
	// public expandedAssetLiabilities?: DtoLiability[];
	private expandedLiabilitiesSubscription?: Subscription;

	// private allAssets?: Asset[];
	// public assets?: Asset[];

	periodTitle(): string {
		const d = new Date();
		const monthIndex = d.getMonth();
		switch (this.current) {
			case 'This':
				return `${monthNames[monthIndex]} ${d.getFullYear()}`;
			case 'Previous':
				return `${
					monthNames[monthIndex === 0 ? 11 : monthIndex - 1]
				} ${d.getFullYear()}`;
			case 'Next':
				return `${
					monthNames[monthIndex === 11 ? 0 : monthIndex + 1]
				} ${d.getFullYear()}`;
			default:
				// this.errorLogger.logError(new Error(`Unknown curent: ${this.current}`));
				return d.getFullYear().toString();
		}
	}

	segmentChanged(ev: CustomEvent): void {
		console.log('Segment changed', ev);
		this.segment = ev.detail.value;
		// this.filterAndOrderAssets();
	}

	changeCurrent(v: 'earlier' | 'later'): void {
		switch (v) {
			case 'earlier':
				switch (this.current) {
					case 'Next':
						this.current = 'This';
						break;
					case 'This':
						this.current = 'Previous';
						break;
					default:
						break;
				}
				break;
			case 'later':
				switch (this.current) {
					case 'Previous':
						this.current = 'This';
						break;
					case 'This':
						this.current = 'Next';
						break;
					default:
						break;
				}
				break;
			default:
				// this.errorLogger.logError(new Error(`Unkown v: ${v}`));
				break;
		}
	}

	expand(assetId: string): void {
		if (this.expandedLiabilitiesSubscription) {
			this.expandedLiabilitiesSubscription.unsubscribe();
		}
		this.expandedAssetId = assetId;

		// this.expandedLiabilitiesSubscription = this.assets.find(a => a.dtoCommune.id === assetId).liabilities.subscribe(liabilities => {
		// 	// console.log(assetId, 'liabilities', liabilities);
		// 	this.expandedAssetLiabilities = liabilities;
		// });
	}

	collapse(): void {
		this.expandedAssetId = '';
	}
}
