import { Page, request } from '@playwright/test';
import {
	getAuth,
	connectAuthEmulator,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	fetchSignInMethodsForEmail,
	Auth,
} from 'firebase/auth';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { FIREBASE_CONFIG, AUTH_ENDPOINT } from './fixtures';

// Firebase app instance
let firebaseApp: FirebaseApp;

/**
 * Get or initialize Firebase app
 */
export function getFirebaseApp(): FirebaseApp {
	if (!firebaseApp) {
		firebaseApp = initializeApp(FIREBASE_CONFIG);
	}
	return firebaseApp;
}

/**
 * Get Firebase auth instance
 */
export function getFirebaseAuth(): Auth {
	return getAuth(getFirebaseApp());
}

/**
 * Initialize Firebase emulators
 */
export async function initializeFirebaseEmulators(): Promise<void> {
	connectAuthEmulator(getFirebaseAuth(), AUTH_ENDPOINT, {
		disableWarnings: true,
	});
	// Clear session storage in browser context only
	try {
		if (
			typeof window !== 'undefined' &&
			typeof window.sessionStorage !== 'undefined'
		) {
			window.sessionStorage.clear();
		}
	} catch {
		// Ignore if not available
	}
}

/**
 * Delete all auth users from emulator
 */
export async function deleteAllAuthUsers(): Promise<void> {
	try {
		const context = await request.newContext();
		const response = await context.delete(
			`${AUTH_ENDPOINT}/emulator/v1/projects/${FIREBASE_CONFIG.projectId}/accounts`,
		);
		await context.dispose();

		if (response.status() !== 200) {
			console.warn(
				`Auth emulator not available or returned ${response.status()}: ${response.statusText()}`,
			);
		}
	} catch (e: any) {
		console.warn(
			'Auth emulator not available, skipping deleteAllAuthUsers()',
			e?.message || e,
		);
	}
}

/**
 * Create a user with email and password
 */
export async function createUser(
	email: string,
	password: string,
): Promise<void> {
	try {
		await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
	} catch (error) {
		console.error('Error creating user:', error);
		throw error;
	}
}

/**
 * Check if a user exists
 */
export async function userExists(email: string): Promise<boolean> {
	try {
		const signInMethods = await fetchSignInMethodsForEmail(
			getFirebaseAuth(),
			email,
		);
		return signInMethods.length > 0;
	} catch (error) {
		return false;
	}
}

/**
 * Sign in programmatically
 */
export async function signInProgrammatically(
	email: string,
	password: string,
): Promise<void> {
	try {
		await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
	} catch (error) {
		console.error('Error signing in:', error);
		throw error;
	}
}

/**
 * Initialize test environment
 */
export async function initializeTestEnvironment(
	email: string,
	password: string,
): Promise<void> {
	await initializeFirebaseEmulators();

	const exists = await userExists(email);
	if (!exists) {
		await createUser(email, password);
	}

	await signInProgrammatically(email, password);
}

/**
 * Check if Auth emulator is available
 */
export async function isAuthEmulatorAvailable(): Promise<boolean> {
	try {
		const context = await request.newContext();
		const response = await context.get(
			`${AUTH_ENDPOINT}/emulator/v1/projects/${FIREBASE_CONFIG.projectId}/config`,
		);
		await context.dispose();
		return response.status() === 200;
	} catch {
		return false;
	}
}

/**
 * Login via UI
 */
export async function loginViaUI(
	page: Page,
	email: string,
	password: string,
): Promise<void> {
	// Click sign in button
	await page
		.locator(
			'sneat-auth-menu-item ion-item ion-label:has-text("Please sign in")',
		)
		.click();

	// Click on the SIGN IN tab
	await page
		.locator('sneat-email-login-form ion-segment-button:has-text("Sign in")')
		.click();

	// Enter credentials
	await page.locator('input[type="email"]').fill(email);
	await page.locator('input[type="password"]').fill(password);

	// Click sign in button
	await page.locator('ion-button ion-label:has-text("Sign in")').click();
}

/**
 * Sign up via UI
 */
export async function signUpViaUI(
	page: Page,
	email: string,
	firstName: string,
	lastName: string,
): Promise<void> {
	// Click sign in button
	await page
		.locator(
			'sneat-auth-menu-item ion-item ion-label:has-text("Please sign in")',
		)
		.click();

	// Enter user information
	await page.locator('input[type="email"]').fill(email);
	await page.locator('input[name="first_name"]').fill(firstName);
	await page.locator('input[name="last_name"]').fill(lastName);

	// Click sign up button
	await page.locator('ion-button ion-label:has-text("Sign up")').click();
}
