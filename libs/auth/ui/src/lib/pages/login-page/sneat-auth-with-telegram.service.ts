import { Injectable, inject } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { SneatAuthStateService } from '@sneat/auth-core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { Observable } from 'rxjs';

export interface ITelegramAuthData {
  id: number;
  first_name: string;
  last_name: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface IResponse {
  token: string;
}

@Injectable()
export class SneatAuthWithTelegramService {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly apiService = inject(SneatApiService);
  private readonly authService = inject(SneatAuthStateService);

  public loginWithTelegram(
    botID: string,
    tgAuthData: ITelegramAuthData,
    isUserAuthenticated: boolean,
  ): void {
    const postRequest: (
      endpoint: string,
      body: unknown,
    ) => Observable<IResponse> = isUserAuthenticated
      ? (endpoint: string, body: unknown) =>
          this.apiService.post<IResponse>(endpoint, body)
      : (endpoint: string, body: unknown) =>
          this.apiService.postAsAnonymous<IResponse>(endpoint, body);
    postRequest(
      'auth/login-from-telegram-widget?botID=' + botID,
      tgAuthData,
    ).subscribe({
      next: (response) => {
// console.log('loginWithTelegram() response:', response);
        this.authService
          .signInWithToken(response.token)
          .then(() => {
// console.log('loginWithTelegram() signed in');
          })
          .catch(
            this.errorLogger.logErrorHandler(
              'Failed to sign-in with custom token',
            ),
          );
      },
      error: this.errorLogger.logErrorHandler('signInWithTelegram() error:'),
    });
  }
}
