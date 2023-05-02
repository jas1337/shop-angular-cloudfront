import { ShippingInfo } from '../../cart/shipping-info.interface';
import { CartItem } from '../../cart/cart.interface';

export interface Order {
  id?: string;
  address: ShippingInfo;
  items: CartItem[];
  status: string;
  total: number;
}
