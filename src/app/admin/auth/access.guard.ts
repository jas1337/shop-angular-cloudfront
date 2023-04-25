import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { NotificationService } from '../../core/notification.service';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('AccessGuard');
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/admin/login']);
      this.notificationService.showError(
        'You must log in to operate the page. User will be created if it does not exist.',
        2000
      );
    }
    return this.authService.isAuthenticated;
  }
}
