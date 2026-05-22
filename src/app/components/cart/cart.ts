import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Cart } from '../../services/cart';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from "@angular/router";
import { CurrencyPipe } from '@angular/common';
import { BaseItem } from '../../models/base.model';

@Component({
  selector: 'app-cart',
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
    CurrencyPipe
],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  private cartService = inject(Cart);
  cartItems = this.cartService.getCart();
  subtotal = this.cartService.subtotal;
  deliveryFee = this.cartService.deliveryFee;
  tax = this.cartService.tax;
  total = this.cartService.total;

  increaseQty(item: BaseItem) {
  this.cartService.increase(item);
}

getQtys(item: BaseItem) {
    return this.cartService.getQty(item);
}

decreaseQty(item: BaseItem) {
  this.cartService.decrease(item);
}

removeItem(id: number) {
  this.cartService.removeItem(id);
}
}
