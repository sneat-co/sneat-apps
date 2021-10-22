import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Injectable,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
	IBoardCardDef,
	IBoardContext,
	sqlWidgetName,
	WidgetName,
} from '@sneat/datatug/models';

@Injectable()
export class BoardCardTabService {
	public $changed = new Subject<string>();
	public changed = this.$changed.asObservable();

	private tab: string;

	public get currentTab() {
		return this.tab;
	}

	public setTab(tab: WidgetName): void {
		this.tab = tab;
	}
}

@Component({
	selector: 'datatug-board-card',
	templateUrl: './board-card.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [BoardCardTabService],
})
export class BoardCardComponent implements OnChanges {
	@Input() boarCardDef: IBoardCardDef;
	@Input() boardContext: IBoardContext;

	constructor(
		public readonly boardCardTab: BoardCardTabService,
		private readonly changeDetectorRef: ChangeDetectorRef
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.boarCardDef && this.boarCardDef) {
			if (this.boarCardDef?.widget?.name === sqlWidgetName) {
				this.boardCardTab.setTab(sqlWidgetName);
			}
		}
	}

	setTab(event: CustomEvent) {
		console.log('setTab', event);
		this.boardCardTab.setTab(event.detail.value as WidgetName);
		this.changeDetectorRef.markForCheck();
	}
}
