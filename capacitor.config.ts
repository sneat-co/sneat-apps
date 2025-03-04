import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'co.sneat.app',
	appName: 'Sneat.app',
	webDir: 'dist/apps/sneat-app',
	plugins: {
		FirebaseAuthentication: {
			skipNativeAuth: false,
			providers: [
				'apple.com',
				'google.com',
				'facebook.com',
				'microsoft.com',
				'phone',
			],
		},
	},
};

export default config;
