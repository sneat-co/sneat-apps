import { FuelTypes } from '../dto';
import { Engine, engines } from './vehicles';

export interface IModel {
	id: string;
	yearMin?: number;
	yearMax?: string;
	engines: Engine[];
}

export interface IMake {
	yearMin?: number;
	yearMax?: string;
	models: IModel[];
}

export const carMakes: Record<string, IMake> = {
	Audi: {
		models: [
			{ id: 'A1', engines },
			{ id: 'A2', engines },
			{ id: 'A3', engines },
			{ id: 'A4', engines },
			{ id: 'A5', engines },
			{ id: 'A6', engines },
			{ id: 'A7', engines },
			{ id: 'A8', engines },
			{ id: 'S4', engines },
			{ id: 'S6', engines },
			{ id: 'S8', engines },
			{ id: 'Q3', engines },
			{ id: 'Q5', engines },
			{ id: 'Q7', engines },
		],
	},
	BMW: {
		models: [
			{ id: '1 Series', engines },
			{ id: '2 Series', engines },
			{ id: '3 Series Saloon', engines },
			{ id: '3 Series Touring', engines },
			{ id: '3 Series Gran Tourismo', engines },
			{ id: '4 Series', engines },
			{ id: '5 Series', engines },
			{ id: '6 Series', engines },
			{ id: '7 Series', engines },
			{ id: '8 Series', engines },
			{ id: 'i3', engines },
			{ id: 'i8 Coupe', engines },
			{ id: 'i8 Roadster', engines },
			{ id: 'X1', engines },
			{ id: 'X2', engines },
			{ id: 'X3', engines },
			{ id: 'X4', engines },
			{ id: 'X5', engines },
			{ id: 'X6', engines },
			{ id: 'X7', engines },
			{ id: 'z3', engines },
			{ id: 'z4', engines },
			{ id: 'z5', engines },
		],
	},
	Toyota: {
		models: [
			{ id: 'Avensis', engines },
			{ id: 'Auris', engines },
			{ id: 'Aygo', engines },
			{ id: 'GR', engines },
			{ id: 'GT86', engines },
			{ id: 'C-HR', engines },
			{ id: 'Camry', engines },
			{ id: 'Corolla', engines },
			{ id: 'Hilux', engines },
			{ id: 'Prius', engines },
			{ id: 'Prius+', engines },
			{ id: 'Proace', engines },
			{ id: 'Proace Verso', engines },
			{ id: 'RAV4', engines },
			{ id: 'Yaris', engines },
		],
	},
	Tesla: {
		yearMin: 2001,
		models: [
			{
				id: 'Model 3',
				yearMin: 2017,
				engines: [{ title: '90KW', engineFuel: FuelTypes.electricity }],
			},
			{
				id: 'Model S',
				engines: [{ title: '90KW', engineFuel: FuelTypes.electricity }],
			},
			{
				id: 'Model X',
				engines: [{ title: '90KW', engineFuel: FuelTypes.electricity }],
			},
		],
	},
	Hyundai: {
		yearMin: 1900,
		models: [
			{ id: 'Kona', engines: [] },
			{ id: 'Tuscan', engines: [] },
		],
	},
};
