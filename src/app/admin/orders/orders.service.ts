import { Injectable, Injector } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { Order } from './order.interface';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';

@Injectable()
export class OrdersService extends ApiService {
  constructor(injector: Injector, private readonly authService: AuthService) {
    super(injector);
  }

  getOrders(): Observable<Order[]> {
    if (!this.endpointEnabled('order')) {
      console.warn(
        'Endpoint "order" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    const url = this.getUrl('order', 'api/profile/order');

    return this.http
      .get<any>(url, {
        headers: {
          Authorization: this.authService.authToken,
        },
      })
      .pipe(map(({ data }) => data.orders));
  }

  createOrder(order: { address: Object; comment: string }): Observable<Order> {
    if (!this.endpointEnabled('order')) {
      console.warn(
        'Endpoint "order" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    const url = this.getUrl('order', 'api/profile/order');
    return this.http
      .post<any>(url, order, {
        headers: {
          Authorization: this.authService.authToken,
        },
      })
      .pipe(map(({ data }) => data.order));
  }
}
