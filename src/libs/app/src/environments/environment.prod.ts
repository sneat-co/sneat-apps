import { IEnvironmentConfig, IFirebaseConfig } from "../lib/environment-config";

const useEmulators = false;

const firebaseConfig: IFirebaseConfig = {
	apiKey: useEmulators
		? "emulator-does-not-need-api-key"
		: "AIzaSyAYGGhSQQ8gUcyPUcUOFW7tTSYduRD3cuw",
	authDomain: "sneat.team",
	databaseURL: useEmulators ? "http://localhost:8080" : undefined,
	projectId: useEmulators ? "demo-sneat" : "sneat-team",
	// 	storageBucket: 'sneat-team.appspot.com',
	// 	messagingSenderId: '724666284649',
	appId: "1:724666284649:web:080ffaab56bb71e49740f8",
	measurementId: "G-RRM3BNCN0S",
};

export const prodEnvironmentConfig: IEnvironmentConfig = {
	production: true,
	useEmulators,
	agents: {},
	firebaseConfig,
};
