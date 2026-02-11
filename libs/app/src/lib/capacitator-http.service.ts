import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Capacitor, CapacitorHttp } from '@capacitor/core';

@Injectable()
export class CapacitorHttpInterceptor implements HttpInterceptor {
  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (Capacitor.isNativePlatform()) {
      // Use Capacitor HTTP only for native iOS/Android, not for web
      return this.handleByCapacitorHttp(req);
    } else {
      // Use standard Angular HTTP for web
      return next.handle(req);
    }
  }

  private handleByCapacitorHttp(
    req: HttpRequest<unknown>,
  ): Observable<HttpEvent<unknown>> {
    const request = {
      method: req.method,
      url: req.url,
      headers: req.headers
        .keys()
        .reduce(
          (acc, key) => ({ ...acc, [key]: req.headers.get(key) || '' }),
          {},
        ),
      params: req.params
        .keys()
        .reduce(
          (acc, key) => ({ ...acc, [key]: req.params.get(key) || '' }),
          {},
        ),
      data: req.body,
    };

    // Use Capacitor HTTP plugin for requests
    const capacitorRequest = from(CapacitorHttp.request({ ...request }));
    return capacitorRequest.pipe(
      map(
        (response) =>
          new HttpResponse({
            status: response.status,
            body: response.data,
          }),
      ),
      catchError((error) =>
        throwError(
          () =>
            new HttpErrorResponse({
              status: error.status,
              statusText: error.error,
              url: req.url,
            }),
        ),
      ),
    );
  }
}
