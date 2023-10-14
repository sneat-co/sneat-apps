import { ICommandDefinition } from '../command-definition';

export const sqlWidgetName = 'SQL';
export type SqlWidgetName = typeof sqlWidgetName;

export interface ISqlWidgetDef extends ICommandDefinition {
	name: SqlWidgetName;
	data: { sql: ISqlWidgetSettings };
}

export interface ISqlWidgetSettings extends ICommandDefinition {
	db?: string;
	env?: string;
	query: string;
	hideColumns?: string[];
}
