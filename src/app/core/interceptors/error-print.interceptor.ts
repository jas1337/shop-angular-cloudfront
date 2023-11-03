import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: ({ status }) => {
          let message;
          switch (status) {
            case 401:
              message = 'User is unauthorized';
              break;
            case 403:
              message = 'Access denied';
              break;
            default:
              const url = new URL(request.url);
              message = `Request to "${url.pathname}" failed. Check the console for the details`;
              break;
          }

          this.notificationService.showError(`Code: ${status}. ${message}`, 0);
        },
      })
    );
  }
}
