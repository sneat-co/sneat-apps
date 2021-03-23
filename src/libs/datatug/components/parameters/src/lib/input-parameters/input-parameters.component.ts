import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {IParameter, IParameterDef, IParamWithDefAndValue} from "@sneat/datatug/models";

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

	public omParamChanged(event: CustomEvent): void {
		this.paramValues.emit(this.parameters.map(p => {
			const {value} = event.detail;
			const param: IParameter = {
				id: p.def.id,
				type: p.def.type,
				value: p.def.type === 'integer' || p.def.type === 'number' ? +value : value
			};
			return param;
		}));
	}
}
