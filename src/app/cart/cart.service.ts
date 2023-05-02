import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiService } from '../core/api.service';
import { Cart } from './cart.interface';
import { Product } from '../products/product.interface';
import { AuthService } from '../admin/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService extends ApiService {
  /** Key - item id, value - ordered amount */
  #cartSource = new BehaviorSubject<Cart | null>(null);

  cart$ = this.#cartSource.asObservable();

  totalInCart$: Observable<number> = this.cart$.pipe(
    map((cart) => {
      if (cart === null || cart.items.length === 0) {
        return 0;
      }
      return cart.items.reduce((acc, { count }) => {
        return acc + count;
      }, 0);
    }),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );

  constructor(injector: Injector, private readonly authService: AuthService) {
    super(injector);
  }

  getCart(): void {
    if (!this.endpointEnabled('cart')) {
      console.warn(
        'Endpoint "cart" is disabled. To enable change your environment.ts config'
      );
      return;
    }
    const url = this.getUrl('cart', 'api/profile/cart');

    this.http
      .get<any>(url, {
        headers: {
          Authorization: this.authService.authToken,
        },
      })
      .subscribe((res) => this.#cartSource.next(res.data.cart));
  }

  addItem(product: Product): any {
    this.updateCount(product, 1);
  }

  removeItem(product: Product): void {
    this.updateCount(product, -1);
  }

  empty(): void {
    this.#cartSource.next(null);
  }

  private updateCount(product: Product, type: 1 | -1): void {
    const cart = this.#cartSource.getValue();

    if (!cart) {
      return;
    }

    const item = cart.items.find((i) => i.product.id === product.id);

    let count = 1;

    if (item) {
      if (type === 1) {
        count = item.count + 1;
      }
      if (type === -1) {
        count = item.count - 1;
      }
    }

    if (!this.endpointEnabled('cart')) {
      console.warn(
        'Endpoint "cart" is disabled. To enable change your environment.ts config'
      );
      return;
    }
    const url = this.getUrl('cart', 'api/profile/cart');

    this.http
      .put<any>(
        url,
        { count, product },
        {
          headers: {
            Authorization: this.authService.authToken,
          },
        }
      )
      .subscribe((res) => this.#cartSource.next(res.data.cart));
  }
}
