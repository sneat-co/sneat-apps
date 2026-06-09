import { IEnvironmentConfig, IFirebaseConfig } from '@sneat/core';

const firebaseConfig: IFirebaseConfig = {
  projectId: 'sneat-eur3-1',
  appId: '1:588648831063:web:303af7e0c5f8a7b10d6b12',
  apiKey: 'AIzaSyCeQu1WC182yD0VHrRm4nHUxVf27fY-MLQ',
  authDomain: 'sneat.app',
  messagingSenderId: '588648831063',
  measurementId: 'G-TYBDTV738R',
};

export const sneatWorkEnvironmentConfig: IEnvironmentConfig = {
  production: true,
  agents: {},
  firebaseConfig,
};
