import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiService } from '../core/api.service';
import { Router } from '@angular/router';
import { Cart } from './cart.interface';
import { Product } from '../products/product.interface';
import { ProductsService } from '../products/products.service';

@Injectable({
  providedIn: 'root',
})
export class CartService extends ApiService {
  /** Key - item id, value - ordered amount */
  #cartSource = new BehaviorSubject<Record<string, number>>({});

  // eslint-disable-next-line @typescript-eslint/member-ordering
  cart$ = this.#cartSource.asObservable();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  totalInCart$: Observable<number> = this.cart$.pipe(
    map((cart) => {
      const values = Object.values(cart);

      if (!values.length) {
        return 0;
      }

      return values.reduce((acc, val) => acc + val, 0);
    }),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );

  readonly products$: Observable<Product[]> =
    this.productsService.getProducts();

  products: Product[] = [];

  constructor(
    injector: Injector,
    private readonly productsService: ProductsService
  ) {
    super(injector);
    this.products$.subscribe((data) => {
      this.products = data;
    });
  }

  getCart(): any {
    if (!this.endpointEnabled('cart')) {
      console.warn(
        'Endpoint "cart" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    const url = this.getUrl('cart', 'api/profile/cart');
    return this.http.get<Cart>(url);
  }

  addItem(id: string): any {
    // addItem(id: string): Observable<any> {
    this.updateCount(id, 1);
    //
    // if (!this.endpointEnabled('cart')) {
    //   console.warn(
    //     'Endpoint "cart" is disabled. To enable change your environment.ts config'
    //   );
    //   return EMPTY;
    // }
    //
    // this.cart$.subscribe((data) => {
    //   debugger;
    // });
    // const url = this.getUrl('cart', 'api/profile/cart');
    //
    // return this.http.post<{
    //   data: { token_type: string; access_token: string };
    // }>(url, data);
  }

  removeItem(id: string): void {
    this.updateCount(id, -1);
  }

  empty(): void {
    this.#cartSource.next({});
  }

  private updateCount(id: string, type: 1 | -1): void {
    const val = this.#cartSource.getValue();
    const newVal = {
      ...val,
    };

    if (!(id in newVal)) {
      newVal[id] = 0;
    }

    if (type === 1) {
      newVal[id] = ++newVal[id];
      this.#cartSource.next(newVal);
      return;
    }

    if (newVal[id] === 0) {
      console.warn('No match. Skipping...');
      return;
    }

    newVal[id]--;

    if (!newVal[id]) {
      delete newVal[id];
    }

    this.#cartSource.next(newVal);
  }
}
