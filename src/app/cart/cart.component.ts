import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CheckoutService } from './checkout.service';
import { Product, ProductCheckout } from '../products/product.interface';
import { Observable } from 'rxjs';
import { CartService } from './cart.service';
import { map, shareReplay } from 'rxjs/operators';
import { OrdersService } from '../admin/orders/orders.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class CartComponent implements OnInit {
  products$!: Observable<ProductCheckout[]>;
  totalPrice$!: Observable<number>;
  totalInCart$!: Observable<number>;
  cartEmpty$!: Observable<boolean>;

  shippingInfo!: UntypedFormGroup;

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly checkoutService: CheckoutService,
    private readonly orderService: OrdersService,
    private readonly cartService: CartService
  ) {}

  get fullName(): string {
    const { firstName, lastName } = this.shippingInfo.value;
    return `${firstName} ${lastName}`;
  }

  get address(): string {
    return this.shippingInfo.value.address;
  }

  get comment(): string {
    return this.shippingInfo.value.comment;
  }

  ngOnInit(): void {
    this.shippingInfo = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      address: ['', Validators.required],
      comment: '',
    });

    this.products$ = this.checkoutService.getProductsForCheckout().pipe(
      shareReplay({
        refCount: true,
        bufferSize: 1,
      })
    );

    this.totalPrice$ = this.products$.pipe(
      map((products) => {
        const total = products.reduce((acc, val) => acc + val.totalPrice, 0);
        return +total.toFixed(2);
      }),
      shareReplay({
        refCount: true,
        bufferSize: 1,
      })
    );

    this.totalInCart$ = this.cartService.totalInCart$;
    this.cartEmpty$ = this.totalInCart$.pipe(map((count) => count > 0));
  }

  mapToProduct(productCheckout: ProductCheckout): Product {
    const { id, title, description, price, count } = productCheckout;
    return { id, title, description, price, count };
  }

  add(productCheckout: ProductCheckout): void {
    this.cartService.addItem(this.mapToProduct(productCheckout));
  }

  remove(productCheckout: ProductCheckout): void {
    this.cartService.removeItem(this.mapToProduct(productCheckout));
  }

  submitOrder() {
    const { firstName, lastName, address, comment } = this.shippingInfo.value;

    this.orderService
      .createOrder({
        address: {
          firstName,
          lastName,
          address,
        },
        comment,
      })
      .subscribe();
  }
}
