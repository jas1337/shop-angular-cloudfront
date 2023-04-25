import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AuthComponent } from './auth/auth.component';
import { AccessGuard } from './auth/access.guard';

const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AccessGuard],
  },
  {
    path: 'products',
    component: ManageProductsComponent,
    canActivate: [AccessGuard],
  },
  {
    path: 'products/new',
    component: EditProductComponent,
    canActivate: [AccessGuard],
  },
  {
    path: 'products/:productId',
    component: EditProductComponent,
    canActivate: [AccessGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AccessGuard],
})
export class AdminRoutingModule {}
