import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { Period } from '@sneat/dto';
import { IAssetContext } from '@sneat/mod-assetus-core';

@Component({
  selector: 'sneat-asset-card',
  templateUrl: './asset-card.component.html',
  imports: [
    RouterModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
  ],
})
export class AssetCardComponent implements OnChanges {
  @Input() period?: Period;
  @Input({ required: true }) asset?: IAssetContext;

  protected segment: 'expenses' | 'income' = 'expenses';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['asset'] && this.asset) {
      const incomes = this.asset?.dbo?.totals?.incomes,
        expenses = this.asset?.dbo?.totals?.expenses;
      if (incomes && (!expenses || incomes.count > expenses.count)) {
        this.segment = 'income';
      }
    }
  }

  segmentChanged(ev: CustomEvent): void {
// console.log('Segment changed', ev);
    this.segment = ev.detail.value;
  }
}
