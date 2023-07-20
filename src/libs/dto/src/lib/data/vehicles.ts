import { EngineType, FuelType } from '../types';

export interface Engine {
	title: string;
	engineType?: EngineType;
	engineFuel: FuelType;
	engineCC?: number;
	engineKW?: number;
	engineNM?: number;
}

export const engines: Engine[] = [
	{ title: 'Petrol 1L', engineCC: 999, engineFuel: 'petrol' },
	{ title: 'Petrol 1.6L', engineCC: 1599, engineFuel: 'petrol' },
	{ title: 'Diesel 2L', engineCC: 1999, engineFuel: 'diesel' },
];

export interface IMake {
	id: string;
	title: string;
}

export interface IModel {
	id: string;
	title: string;
}
