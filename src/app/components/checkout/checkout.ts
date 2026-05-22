import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Cart } from '../../services/cart';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkout {
  private cartService = inject(Cart);

  cartItems = this.cartService.getCart();
  subtotal = this.cartService.subtotal;
  deliveryFee = this.cartService.deliveryFee;
  tax = this.cartService.tax;
  total = this.cartService.total;
}
