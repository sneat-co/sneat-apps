import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Period } from '@sneat/dto';
import { IAssetDtoBase } from '@sneat/mod-assetus-core';

@Component({
	selector: 'sneat-asset-card',
	templateUrl: './asset-card.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class AssetCardComponent implements OnChanges {
	@Input() period?: Period;
	@Input({ required: true }) asset?: IAssetDtoBase;

	protected segment: 'expenses' | 'income' = 'expenses';

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['asset'] && this.asset) {
			const incomes = this.asset.totals?.incomes,
				expenses = this.asset.totals?.expenses;
			if (incomes && (!expenses || incomes.count > expenses.count)) {
				this.segment = 'income';
			}
		}
	}

	segmentChanged(ev: CustomEvent): void {
		console.log('Segment changed', ev);
		this.segment = ev.detail.value;
	}
}
