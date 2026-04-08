import { IEnvironmentConfig, IFirebaseConfig } from '@sneat/core';

const firebaseConfig: IFirebaseConfig = {
  projectId: 'sneat-eur3-1',
  appId: '1:588648831063:web:303af7e0c5f8a7b10d6b12',
  apiKey: 'AIzaSyCeQu1WC182yD0VHrRm4nHUxVf27fY-MLQ',
  authDomain: 'sneat.app',
  messagingSenderId: '588648831063',
  measurementId: 'G-TYBDTV738R',
};

export const sneatAppEnvironmentConfig: IEnvironmentConfig = {
  production: true,
  agents: {},
  firebaseConfig,
  posthog: {
    token: 'phc_YBZyRpV92s1kC0D4vYjEQiWhVjK7U9vfyi9vh2jfbsD',
    config: {
      api_host: 'https://eu.i.posthog.com',
      person_profiles: 'identified_only',
    },
  },
  sentry: {
    dsn: 'https://2cdec43e82bc42e98821becbfe251778@o355000.ingest.sentry.io/6395241',
  },
};
