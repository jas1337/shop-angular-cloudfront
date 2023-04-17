import { Component, OnInit } from '@angular/core';
import { CartService } from '../../cart/cart.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../admin/auth/auth.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  totalInCart$!: Observable<number>;

  get isAuthenticated() {
    return this.loginService.isAuthenticated;
  }

  constructor(
    private readonly cartService: CartService,
    private readonly loginService: AuthService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cartService.getCart();
    this.totalInCart$ = this.cartService.totalInCart$;
  }

  logOut() {
    this.loginService.logOut();
    this.notificationService.showError('You were logged out', 1000);
  }
}
