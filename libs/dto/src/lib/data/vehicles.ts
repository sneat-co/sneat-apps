import { EngineType, FuelType, FuelTypes } from '../types';

export interface Engine {
	title: string;
	engineType?: EngineType;
	engineFuel: FuelType;
	engineCC?: number;
	engineKW?: number;
	engineNM?: number;
}

export const engines: Engine[] = [
	{ title: 'Petrol 1L', engineCC: 999, engineFuel: FuelTypes.petrol },
	{ title: 'Petrol 1.6L', engineCC: 1599, engineFuel: FuelTypes.petrol },
	{ title: 'Diesel 2L', engineCC: 1999, engineFuel: FuelTypes.diesel },
];

export interface IMake {
	id: string;
	title: string;
}

export interface IModel {
	id: string;
	title: string;
}
