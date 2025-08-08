import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Injectable,
	Input,
	OnChanges,
	SimpleChanges,
	inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonIcon,
	IonItem,
	IonLabel,
	IonSegment,
	IonSegmentButton,
} from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import {
	IBoardCardDef,
	IBoardContext,
} from '../../../../models/definition/board/board';
import { WidgetName } from '../../../../models/definition/board/widget-name';
import { sqlWidgetName } from '../../../../models/definition/board/widget-sql';
import { QueryType } from '../../../../models/definition/query-def';
import { BoardWidgetComponent } from '../board-widget/board-widget.component';

@Injectable()
export class BoardCardTabService {
	public $changed = new Subject<string>();
	public changed = this.$changed.asObservable();

	private tab?: QueryType | 'grid' | 'card';

	public get currentTab() {
		return this.tab;
	}

	public setTab(tab: WidgetName): void {
		this.tab = tab as QueryType | 'grid' | 'card';
	}
}

@Component({
	selector: 'sneat-datatug-board-card',
	templateUrl: './board-card.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [BoardCardTabService],
	imports: [
		IonCard,
		IonItem,
		IonLabel,
		IonButtons,
		IonSegment,
		FormsModule,
		IonSegmentButton,
		IonButton,
		IonIcon,
		BoardWidgetComponent,
	],
})
export class BoardCardComponent implements OnChanges {
	readonly boardCardTab = inject(BoardCardTabService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	@Input() boarCardDef?: IBoardCardDef;
	@Input() boardContext?: IBoardContext;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['boarCardDef'] && this.boarCardDef) {
			if (this.boarCardDef?.widget?.name === sqlWidgetName) {
				this.boardCardTab.setTab(sqlWidgetName);
			}
		}
	}

	setTab(event: Event) {
		console.log('setTab', event);
		const ce = event as CustomEvent;
		this.boardCardTab.setTab(ce.detail.value as WidgetName);
		this.changeDetectorRef.markForCheck();
	}
}
