import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Order, CartItem, OrderService } from '../../services/product.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-orders',
  imports: [
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Orders implements OnInit {
  private readonly orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  displayCurrency = environment.paymentCurrency || 'USD';
  readonly skeletonOrders = Array.from({ length: 3 });

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || error.message || 'Unable to load orders.');
        this.isLoading.set(false);
      },
    });
  }

  orderId(order: Order) {
    return order.id || order._id || '';
  }

  shortOrderId(order: Order) {
    const id = this.orderId(order);
    return id ? id.slice(-8).toUpperCase() : 'ORDER';
  }

  itemName(item: CartItem) {
    return item.name || item.product?.name || 'Product';
  }

  itemImage(item: CartItem) {
    return item.imageUrl || item.product?.imageUrl || '';
  }

  address(order: Order) {
    const shippingAddress = order.shippingAddress;

    if (!shippingAddress) {
      return '';
    }

    return [
      shippingAddress.addressLine1 || shippingAddress.street,
      shippingAddress.addressLine2,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.postalCode || shippingAddress.zipCode,
      shippingAddress.country,
    ].filter(Boolean).join(', ');
  }

  paymentId(order: Order) {
    return order.payment?.paymentId || '';
  }

  paymentProvider(order: Order) {
    return order.payment?.provider || 'razorpay';
  }

  trackOrder(_: number, order: Order) {
    return this.orderId(order);
  }

  trackItem(index: number, item: CartItem) {
    return item._id || item.productId || item.product?._id || `${this.itemName(item)}-${index}`;
  }
}
