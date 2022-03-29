import { LOGGER_FACTORY } from '@sneat/core';
import { loggerFactory } from '@sneat/rxstore';

export const coreProviders = [
	{ provide: LOGGER_FACTORY, useValue: loggerFactory },
];
