import {FuelType} from '../types';

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

export const carMakes: {
	[make: string]: {
		yearMin?: number;
		yearMax?: string;
		models: {
			model: string;
			yearMin?: number;
			yearMax?: string;
			engines: Engine[];
		}[];
	};
} = {
	Audi: {
		models: [
			{model: 'A1', engines},
			{model: 'A2', engines},
			{model: 'A3', engines},
			{model: 'A4', engines},
			{model: 'A5', engines},
			{model: 'A6', engines},
			{model: 'A7', engines},
			{model: 'A8', engines},
			{model: 'S4', engines},
			{model: 'S6', engines},
			{model: 'S8', engines},
			{model: 'Q3', engines},
			{model: 'Q5', engines},
			{model: 'Q7', engines},
		]
	},
	BMW: {
		models: [
			{model: '1 Series', engines},
			{model: '2 Series', engines},
			{model: '3 Series Saloon', engines},
			{model: '3 Series Touring', engines},
			{model: '3 Series Gran Tourismo', engines},
			{model: '4 Series', engines},
			{model: '5 Series', engines},
			{model: '6 Series', engines},
			{model: '7 Series', engines},
			{model: '8 Series', engines},
			{model: 'i3', engines},
			{model: 'i8 Coupe', engines},
			{model: 'i8 Roadster', engines},
			{model: 'X1', engines},
			{model: 'X2', engines},
			{model: 'X3', engines},
			{model: 'X4', engines},
			{model: 'X5', engines},
			{model: 'X6', engines},
			{model: 'X7', engines},
			{model: 'z3', engines},
			{model: 'z4', engines},
			{model: 'z5', engines},
		]
	},
	Toyota: {
		models: [
			{model: 'Avensis', engines},
			{model: 'Auris', engines},
			{model: 'Aygo', engines},
			{model: 'GR', engines},
			{model: 'GT86', engines},
			{model: 'C-HR', engines},
			{model: 'Camry', engines},
			{model: 'Corolla', engines},
			{model: 'Hilux', engines},
			{model: 'Prius', engines},
			{model: 'Prius+', engines},
			{model: 'Proace', engines},
			{model: 'Proace Verso', engines},
			{model: 'RAV4', engines},
			{model: 'Yaris', engines},
		]
	},
	Tesla: {
		yearMin: 2001,
		models: [
			{model: 'Model 3', yearMin: 2017, engines: [{title: '90KW', fuel: 'battery'}]},
			{model: 'Model S', engines: [{title: '90KW', fuel: 'battery'}]},
			{model: 'Model X', engines: [{title: '90KW', fuel: 'battery'}]},
		],
	},
	Hyundai: {
		yearMin: 1900,
		models: [
			{model: 'Kona', engines: []},
			{model: 'Tuscan', engines: []},
		],
	},
};
