import { Injectable, Injector } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { Order, StatusHistory } from './order.interface';
import { Product } from '../../products/product.interface';
import { ApiService } from '../../core/api.service';
import { ShippingInfo } from '../../cart/shipping-info.interface';

@Injectable()
export class OrdersService extends ApiService {
  constructor(injector: Injector) {
    super(injector);
  }

  getOrders(): Observable<Order[]> {
    return of([]);
  }

  createOrder(order: Order): Observable<Order> {
    if (!this.endpointEnabled('order')) {
      console.warn(
        'Endpoint "order" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    const url = this.getUrl('order', 'api/profile/cart/checkout');
    return this.http.post<Order>(url, order);
  }
}
