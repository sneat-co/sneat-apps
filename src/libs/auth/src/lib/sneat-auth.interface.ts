import { InjectionToken } from '@angular/core';

export interface ILoginEventsHandler {
	onLoggedIn(): void;
}

export const LoginEventsHandler = new InjectionToken('ILoginEventsHandler');
