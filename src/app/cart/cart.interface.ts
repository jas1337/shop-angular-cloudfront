import { Product } from '../products/product.interface';

export type CartItem = {
  product: Product;
  count: number;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
  status: Status;
};

export enum Status {
  open = 'OPEN',
  odered = 'ORDERED',
}
