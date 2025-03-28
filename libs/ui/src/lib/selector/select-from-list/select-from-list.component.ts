import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	EventEmitter,
	forwardRef,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	signal,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import {
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, IonInput, IonSelect } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { NEVER, Observable, Subject, takeUntil } from 'rxjs';
import { ISelectItem } from '../selector-interfaces';

@Component({
	selector: 'sneat-select-from-list',
	templateUrl: './select-from-list.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SelectFromListComponent),
			multi: true,
		},
	],
	imports: [IonicModule, FormsModule, RouterModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFromListComponent
	implements ControlValueAccessor, OnChanges, OnDestroy
{
	@Input() value = '';
	@Output() readonly valueChange = new EventEmitter<string>();

	@Input() filterLabel = 'Find';
	@Input() label = 'Please choose';
	@Input() listLabel?: 'divider';
	@Input() listLabelColor?:
		| 'light'
		| 'medium'
		| 'primary'
		| 'secondary'
		| 'tertiary';
	@Input() isFilterable?: boolean;
	@Input() isLoading?: boolean;
	@Input() items?: readonly ISelectItem[];
	@Input() items$: Observable<ISelectItem[]> = NEVER;
	private $items = signal<undefined | readonly ISelectItem[]>(undefined);

	@Input() labelPlacement?: 'start' | 'end' | 'fixed' | 'stacked';
	@Input() justify?: 'start' | 'end' | 'space-between';
	@Input() other: 'top' | 'bottom' | 'none' = 'none';
	@Input() canAdd = false;
	@Input() filterItem?: (item: ISelectItem, filter: string) => boolean;

	@Output() readonly filterChanged = new EventEmitter<string>();

	@Input() selectMode: 'single' | 'multiple' = 'single';

	@Input() isReadonly = false;

	// @Input() ngModel?: string;
	// @Output() readonly ngModelChange = new EventEmitter<string>();

	private destroyed = new Subject<void>();

	@ViewChild(IonInput, { static: false }) addInput?: IonInput;
	@ViewChild('filterInput', { static: false }) filterInput?: IonInput;
	@ViewChild('selectInput', { static: false }) selectInput?: IonSelect;

	protected readonly $displayItems = signal<undefined | readonly ISelectItem[]>(
		undefined,
	);

	protected readonly $hiddenCount = computed(() => {
		return (this.$items()?.length || 0) - (this.$displayItems()?.length || 0);
	});

	protected isDisabled = false;

	protected readonly $filter = signal('');

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {}

	public focus(): void {
		console.log('SelectFromListComponent.focus()');
		setTimeout(() => {
			console.log(
				'SelectFromListComponent.focus(), filterInput:',
				this.filterInput,
			);
			this.filterInput
				?.setFocus()
				.catch(
					this.errorLogger.logErrorHandler(
						'Failed to set focus to filter input',
					),
				);
		}, 100);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['items']) {
			this.$items.set(this.items);
			this.applyFilter();
		}
		if (changes['items$'] && this.items$) {
			this.items$?.pipe(takeUntil(this.destroyed)).subscribe((items) => {
				this.$items.set(items);
				this.applyFilter();
			});
		}
	}

	private applyFilter(): void {
		const f = this.$filter().trim().toLowerCase();
		// console.log('SelectFromListComponent.applyFilter', f);
		const items = this.$items();
		this.$displayItems.set(
			f
				? items?.filter(
						(v) =>
							v.title.toLowerCase().includes(f) ||
							v.longTitle?.toLowerCase().includes(f) ||
							(this.filterItem && this.filterItem(v, f)),
					)
				: items,
		);
	}

	protected select(item: ISelectItem): void {
		console.log('SelectFromListComponent.select()', item);
		switch (this.selectMode) {
			case 'multiple':
				return;
			case 'single':
				this.value = item.id;
				this.onChange(this.value);
				this.clearFilter();
		}
	}

	protected onRadioChanged(event: Event): void {
		if (this.selectMode !== 'single') {
			return;
		}
		this.value = (event as CustomEvent).detail['value'] as string;
		this.onChange(this.value);
		this.clearFilter();
	}

	protected onSelectChanged(event: Event): void {
		console.log('SelectFromListComponent.onSelectChanged()', event);
		// this.value = (event as CustomEvent).detail['value'] as string;
		this.onChange(this.value);
	}

	protected onChange = (v: unknown) => {
		console.log('SelectFromListComponent.onChange()', v);
		this.value = v as string;
		this.valueChange.emit(this.value);
	};

	onTouched: () => void = () => void 0;

	registerOnChange(fn: (v: unknown) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
	}

	writeValue(obj: unknown): void {
		this.value = obj as string;
	}

	protected onFilterChanged(
		event: CustomEvent,
		source: 'ionChange' | 'ionInput',
	): void {
		console.log(
			`SelectFromListComponent.onFilterChanged(source=${source})`,
			event,
		);
		this.$filter.set(event.detail.value || '');
		this.applyFilter();
		this.filterChanged.emit(this.$filter());
	}

	protected clearFilter(): void {
		this.$filter.set('');
		this.filterChanged.emit(this.$filter());
		this.applyFilter();
	}

	protected deselect(): void {
		this.value = '';
		this.onChange(this.value);
	}

	protected onAdd(event: Event): void {
		event.preventDefault();
		this.value = this.$filter();
		this.onChange(this.value);
	}

	protected onCheckboxChange(event: CustomEvent, item: ISelectItem): void {
		console.log('SelectFromListComponent.onCheckboxChange()', event, item);
	}

	ngOnDestroy(): void {
		this.destroyed.next();
	}
}
