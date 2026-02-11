import { IEnvironmentConfig, IFirebaseConfig } from '@sneat/core';
// import { firebaseEmulatorConfig } from './environment.base';

export const firebaseConfigForSneatApp: IFirebaseConfig = {
  // emulator: firebaseEmulatorConfig,
  projectId: 'sneat-eur3-1',
  appId: '1:588648831063:web:303af7e0c5f8a7b10d6b12',
  apiKey: 'AIzaSyCeQu1WC182yD0VHrRm4nHUxVf27fY-MLQ',
  authDomain: 'sneat.app',
  messagingSenderId: '588648831063',
  measurementId: 'G-TYBDTV738R',
};

export const prodEnvironmentConfig: IEnvironmentConfig = {
  production: true,
  agents: {},
  firebaseConfig: firebaseConfigForSneatApp,
};
