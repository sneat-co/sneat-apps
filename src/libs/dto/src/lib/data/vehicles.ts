import { FuelType } from '../types';

export interface Engine {
	fuel: FuelType;
	title: string;
	cc?: number;
}

export const engines: Engine[] = [
	{title: 'Petrol 1L', cc: 999, fuel: 'petrol'},
	{title: 'Petrol 1.6L', cc: 1599, fuel: 'petrol'},
	{title: 'Diesel 2L', cc: 1999, fuel: 'diesel'},
];

export interface IMake {
	id: string;
	title: string;
}

export interface IModel {
	id: string;
	title: string;
}
