import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { ProductsService } from '../products/products.service';
import { Observable } from 'rxjs';
import { ProductCheckout } from '../products/product.interface';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(
    private readonly cartService: CartService,
    private readonly productsService: ProductsService
  ) {}

  getProductsForCheckout(): Observable<ProductCheckout[]> {
    return this.cartService.cart$.pipe(
      switchMap((cart) => {
        const idsProducts = cart?.items.map((i) => i.product.id) || [];
        return this.productsService.getProductsForCheckout(idsProducts).pipe(
          map((products) =>
            products.map((product) => {
              const count =
                cart?.items.find((i) => i.product.id === product.id)?.count ||
                0;
              return {
                ...product,
                orderedCount: count,
                totalPrice: +(count * product.price).toFixed(2),
              };
            })
          )
        );
      })
    );
  }
}
