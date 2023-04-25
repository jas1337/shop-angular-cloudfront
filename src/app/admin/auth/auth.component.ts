import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { NotificationService } from '../../core/notification.service';
import { AuthService } from './auth.service';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit, OnDestroy {
  loginForm: UntypedFormGroup;

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
    private readonly cartService: CartService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get usernameCtrl(): AbstractControl {
    return this.loginForm.get('username') as AbstractControl;
  }

  get passwordCtrl(): AbstractControl {
    return this.loginForm.get('password') as AbstractControl;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  logIn(): void {
    const { username, password } = this.loginForm.value;

    this.authService.authenticateUser({ username, password }).subscribe(() => {
      this.cartService.getCart();
      this.notificationService.showError(
        `You were logged in as: ${username}`,
        2000
      );
    });
  }
}
