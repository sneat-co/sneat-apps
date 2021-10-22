import { IParameterDef, IParameterValueWithoutID } from '../parameter';
import { WidgetDef } from './widgets';

export interface IBoardDef {
	id: string;
	title: string;
	description?: string;
	rows?: IBoardRowDef[];
	parameters?: IParameterDef[];
	tags?: string[];
	related?: {
		boards?: string[];
	};
}

export interface IBoardRowDef {
	minHeight?: string;
	maxHeight?: string;
	cards?: IBoardCardDef[]; // No more then 4 cards per row as we have only 12 available columns
}

export interface IBoardCardDef {
	id: string; // Card ID, good to have for reordering for example
	title: string;
	cols?: number; // Specifies how many of 12 available columns it can take
	widget?: WidgetDef;
}

export interface IWidgetPosition {
	rowIndex: number;
	colIndex: number;
}

export interface IBoardWidgetInstance {
	initBoardWidget?: (position: IWidgetPosition) => void;
}

export interface IBoardContext {
	mode: 'edit' | 'view';
	parameters: { [name: string]: IParameterValueWithoutID };
}
