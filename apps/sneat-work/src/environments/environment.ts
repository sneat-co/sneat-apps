import { appEnvironmentConfig } from '@sneat/app';
import { IEnvironmentConfig } from '@sneat/core';

// Single environment for sneat-work — fail-safe by construction.
// appEnvironmentConfig returns this production config on every deployed domain
// and the Firebase emulator config only on localhost (decided at runtime from
// the hostname). No environment.prod.ts / fileReplacements: a mis-built or
// mis-deployed bundle can never point real users at the emulator.
export const sneatWorkEnvironmentConfig: IEnvironmentConfig =
  appEnvironmentConfig({
    production: true,
    agents: {},
    firebaseConfig: {
      projectId: 'sneat-eur3-1',
      appId: '1:588648831063:web:303af7e0c5f8a7b10d6b12',
      apiKey: 'AIzaSyCeQu1WC182yD0VHrRm4nHUxVf27fY-MLQ',
      authDomain: 'sneat.app',
      messagingSenderId: '588648831063',
      measurementId: 'G-TYBDTV738R',
    },
  });
