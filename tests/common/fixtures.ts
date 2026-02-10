// Test data and constants used across tests

export const MOCK_USER_EMAIL = 'testsignin@gmail.com';
export const MOCK_USER_PASS = 'password';

export const TEST_USER_EMAIL = 'test@gmail.com';
export const TEST_USER_PASS = 'password';

export const FIREBASE_CONFIG = {
	emulator: {
		firestoreHost: '127.0.0.1',
		authPort: 9099,
		firestorePort: 8080,
	},
	apiKey: 'AIzaSyAYGGhSQQ8gUcyPUcUOFW7tTSYduRD3cuw',
	authDomain: 'sneat.app',
	projectId: 'demo-sneat-app', // In real app The 'demo-' prefix is added if useEmulators is true
	appId: '1:724666284649:web:080ffaab56bb71e49740f8',
	measurementId: 'G-RRM3BNCN0S',
};

// Auth emulator endpoint
export const AUTH_ENDPOINT = `http://${FIREBASE_CONFIG.emulator.firestoreHost}:${FIREBASE_CONFIG.emulator.authPort}`;
