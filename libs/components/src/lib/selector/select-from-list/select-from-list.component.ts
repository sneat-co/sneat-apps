import {
	Component,
	EventEmitter,
	forwardRef,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput, IonSelect } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { NEVER, Observable, Subject, takeUntil } from 'rxjs';
import { ISelectItem } from '..';

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
})
export class SelectFromListComponent
	implements ControlValueAccessor, OnChanges, OnDestroy
{
	@Input() value = '';
	@Output() readonly valueChange = new EventEmitter<string>();

	@Input() filterLabel = 'Find';
	@Input() label = 'Please choose';
	@Input() isFilterable?: boolean;
	@Input() isLoading?: boolean;
	@Input() items?: readonly ISelectItem[];
	@Input() items$: Observable<ISelectItem[]> = NEVER;
	@Input() radioSlot?: 'start' | 'end';
	@Input() other: 'top' | 'bottom' | 'none' = 'none';
	@Input() canAdd = false;

	@Input() readonly = false;

	// @Input() ngModel?: string;
	// @Output() readonly ngModelChange = new EventEmitter<string>();

	private destroyed = new Subject<void>();

	@Output() changed = new EventEmitter<string>();

	@ViewChild(IonInput, { static: false }) addInput?: IonInput;
	@ViewChild('filterInput', { static: false }) filterInput?: IonInput;
	@ViewChild('selectInput', { static: false }) selectInput?: IonSelect;

	protected displayItems?: readonly ISelectItem[];
	protected hiddenCount = 0;

	protected isDisabled = false;

	protected filter = '';

	protected readonly id = (_: number, o: ISelectItem) => o.id;

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
			this.applyFilter();
		}
		if (changes['items$'] && this.items$) {
			this.items$?.pipe(takeUntil(this.destroyed)).subscribe((items) => {
				this.items = items;
				this.applyFilter();
			});
		}
	}

	private applyFilter(): void {
		const f = this.filter.trim().toLowerCase();
		console.log('SelectFromListComponent.applyFilter', f);
		this.displayItems = f
			? this.items?.filter((v) => v.title.toLowerCase().includes(f))
			: this.items;
		this.hiddenCount =
			(this.items?.length || 0) - (this.displayItems?.length || 0);
	}

	protected select(item: ISelectItem): void {
		console.log('SelectFromListComponent.select()', item);
		this.value = item.id;
		this.onChange(this.value);
	}

	protected onRadioChanged(event: Event): void {
		this.value = (event as CustomEvent).detail['value'] as string;
		this.onChange(this.value);
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

	protected onFilterChanged(): void {
		console.log('SelectFromListComponent.onFilterChanged()', this.filter);
		this.applyFilter();
	}

	protected clearFilter(): void {
		this.filter = '';
		this.applyFilter();
	}

	protected deselect(): void {
		this.value = '';
		this.onChange(this.value);
	}

	protected onAdd(event: Event): void {
		event.preventDefault();
		this.value = this.filter;
		this.onChange(this.value);
	}

	ngOnDestroy(): void {
		this.destroyed.next();
	}
}
