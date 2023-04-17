import { Injectable, Injector } from '@angular/core';
import { EMPTY, flatMap, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from './user.interface';

@Injectable()
export class AuthService extends ApiService {
  user: User | undefined;

  get isAuthenticated() {
    return !!this.authToken;
  }

  get authToken(): string {
    return localStorage.getItem('authorization_token') || '';
  }

  constructor(injector: Injector, private readonly router: Router) {
    super(injector);

    this.loadUserFromLocalStorage();
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

    const url = this.getUrl('order', 'api/auth/login');

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
          if (data.user_data) {
            localStorage.setItem('user', JSON.stringify(data.user_data));
            this.loadUserFromLocalStorage();
          }
          this.router.navigate(['/']);
          return data;
        })
      );
  }

  logOut() {
    localStorage.removeItem('authorization_token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  loadUserFromLocalStorage() {
    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch (e: any) {
        throw new Error(e);
      }
    }
  }
}
