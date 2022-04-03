import { LOGGER_FACTORY } from './logging';
import { loggerFactory } from '@sneat/rxstore';

export const coreProviders = [
	{ provide: LOGGER_FACTORY, useValue: loggerFactory },
];
