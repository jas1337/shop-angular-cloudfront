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
    private readonly loginService: AuthService
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

    this.loginService.authenticateUser({ username, password }).subscribe(() => {
      this.notificationService.showError(
        `You were logged in as: ${username}`,
        1000
      );
    });
  }
}
