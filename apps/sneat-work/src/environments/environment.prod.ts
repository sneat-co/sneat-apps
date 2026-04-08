import { IEnvironmentConfig, IFirebaseConfig } from '@sneat/core';

const firebaseConfig: IFirebaseConfig = {
  projectId: 'sneat-work',
  apiKey: 'AIzaSyB2566A1kaT7H2qXSFHwBLcvmw7-nowp78',
  authDomain: 'sneat-work.firebaseapp.com',
  messagingSenderId: '125224789205',
  appId: '1:125224789205:web:d9fdf66322b9a871a5ae5c',
  measurementId: 'G-3KWL5H12LW',
};

export const sneatWorkEnvironmentConfig: IEnvironmentConfig = {
  production: true,
  agents: {},
  firebaseConfig,
};
