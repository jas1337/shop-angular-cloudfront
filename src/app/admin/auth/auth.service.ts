import { Injectable, Injector } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthService extends ApiService {
  get isAuthenticated() {
    return !!this.authToken;
  }

  get authToken(): string {
    return localStorage.getItem('authorization_token') || '';
  }

  constructor(injector: Injector, private readonly router: Router) {
    super(injector);
  }

  authenticateUser(data: {
    username: string;
    password: string;
  }): Observable<any> {
    if (!this.endpointEnabled('auth')) {
      console.warn(
        'Endpoint "auth" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    const url = this.getUrl('auth', 'api/auth/login');

    return this.http
      .post<{
        data: { token_type: string; access_token: string; user_data: string };
      }>(url, data)
      .pipe(
        map(({ data }) => {
          localStorage.setItem(
            'authorization_token',
            `${data.token_type} ${data.access_token}`
          );
          this.router.navigate(['/']);
          return data;
        })
      );
  }

  logOut() {
    localStorage.removeItem('authorization_token');
    this.router.navigate(['/admin/login']);
  }
}
