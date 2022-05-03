import {Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {Period} from 'sneat-shared/models/types';
import {DtoLiability} from 'sneat-shared/models/dto/dto-liability';
import {Asset} from 'sneat-shared/models/ui/ui-asset';
import {IAssetService, IErrorLogger} from 'sneat-shared/services/interfaces';
import {IRecord, RxRecordKey} from 'rxstore';

const monthNames = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];

@Component({
	selector: 'app-month',
	templateUrl: './month-page.component.html',
	styleUrls: ['./month.page.scss'],
})
export class MonthPageComponent {

	public segment: 'expense' | 'income' | 'balance' = 'expense';
	public period: Period = 'month';
	public current: 'This' | 'Next' | 'Previous' = 'This';
	public balance: number;

	public expandedAssetId: string;
	public expandedAssetLiabilities: DtoLiability[];
	private expandedLiabilitiesSubscription: Subscription;

	private allAssets: Asset[];
	public assets: Asset[];

	constructor(
		assetService: IAssetService,
		private errorLogger: IErrorLogger,
	) {
		assetService.userAssets()
			.subscribe({
				next: assets => {
					console.log('MonthPage.assets: ', assets);
					this.allAssets = assets;
					this.filterAndOrderAssets();
				},
				error: this.errorLogger.logErrorHandler('failed on loading assets'),
			});
	}

	private filterAndOrderAssets(): void {
		const s = this.segment;
		this.assets = this.allAssets.filter(a => s === 'expense' ? a.totals.expenses.count : s === 'income' ? a.totals.count : true);
		this.balance = 0;
		switch (this.segment) {
			case 'expense':
				this.assets = this.allAssets
					.filter(a => a.totals.expenses.count)
					.sort((a1, a2) => a2.totals.expenses.perMonth() - a1.totals.expenses.perMonth());
				this.balance = this.assets.map(a => a.totals.expenses.perMonth())
					.reduce((a, b) => a + b);
				break;
			case 'income':
				this.assets = this.allAssets
					.filter(a => a.totals.incomes.count)
					.sort((a1, a2) => a2.totals.incomes.perMonth() - a1.totals.incomes.perMonth());
				this.balance = this.assets.map(a => a.totals.incomes.perMonth())
					.reduce((a, b) => a + b);
				break;
			case 'balance':
				this.assets = this.allAssets
					.filter(a => a.totals.count)
					.sort((a1, a2) => Math.abs(a2.totals.per('month')) - Math.abs(a1.totals.per('month')));
				this.balance = this.assets.map(a => a.totals.per('month'))
					.reduce((a, b) => a + b);
				break;
			default:
				this.errorLogger.logError(new Error(`Unknown segment: ${this.segment}`));
				break;
		}
	}

	periodTitle(): string {
		const d = new Date();
		const monthIndex = d.getMonth();
		switch (this.current) {
			case 'This':
				return `${monthNames[monthIndex]} ${d.getFullYear()}`;
			case 'Previous':
				// tslint:disable-next-line:no-magic-numbers
				return `${monthNames[monthIndex === 0 ? 11 : monthIndex - 1]} ${d.getFullYear()}`;
			case 'Next':
				// tslint:disable-next-line:no-magic-numbers
				return `${monthNames[monthIndex === 11 ? 0 : monthIndex + 1]} ${d.getFullYear()}`;
			default:
				this.errorLogger.logError(new Error(`Unknown curent: ${this.current}`));
				return d.getFullYear()
					.toString();
		}
	}

	segmentChanged(ev: CustomEvent): void {
		console.log('Segment changed', ev);
		this.segment = ev.detail.value;
		this.filterAndOrderAssets();
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
				this.errorLogger.logError(new Error(`Unkown v: ${v}`));
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

	// tslint:disable-next-line:prefer-function-over-method
	trackById(i: number, record: IRecord): RxRecordKey | undefined {
		return record.id;
	}
}
