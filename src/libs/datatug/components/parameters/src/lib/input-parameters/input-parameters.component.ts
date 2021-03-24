import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {IParameter, IParameterDef, IParamWithDefAndValue, ParameterValue} from "@sneat/datatug/models";

@Component({
	selector: 'datatug-input-parameters',
	templateUrl: './input-parameters.component.html',
	styleUrls: ['./input-parameters.component.scss']
})
export class InputParametersComponent implements OnChanges {

	@Input()
	public paramDefs: IParameterDef[];

	public parameters: IParamWithDefAndValue[];

	@Output()
	public readonly paramValues = new EventEmitter<IParameter[]>();

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.paramDefs) {
			this.parameters = this.paramDefs?.map(def => ({
				def,
				val: this.parameters?.find(p => p.def.id === def.id)?.val,
			}));
		}
	}

	public get hasParamValues(): boolean {
		return !!this.parameters?.find(p => p.val !== undefined);
	}

	public clearAllParams(event: Event): void {
		this.parameters.forEach(p => p.val = undefined);
	}

	public onParamChanged(event: CustomEvent, parameter: IParamWithDefAndValue): void {
		const {value} = event.detail;
		console.log('omParamChanged:', value, parameter)
		this.paramValues.emit(this.parameters.map(p => {
			const v = p.def.id === parameter.def.id ? value : p.val;
			let pVal: ParameterValue;
			if (p.def.type === 'integer' || p.def.type === 'number') {
				if (v === undefined || v === null || v === '') {
					pVal = undefined;
				} else {
					pVal =  +v;
					if (isNaN(pVal)) {
						throw new Error(`Got a not a number for ${p.def.type} parameter`)
					}
				}
			}
			const param: IParameter = {
				id: p.def.id,
				type: p.def.type,
				value: pVal,
			};
			return param;
		}));
	}
}
