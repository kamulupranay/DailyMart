import { computed, Injectable, signal } from '@angular/core';
import { BaseItem } from '../models/base.model';

export type CartItem = BaseItem & { qty: number };

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private cart = signal<CartItem[]>([]);
  private qtyById = computed(() => new Map(this.cart().map(item => [item.id, item.qty])));

  getCart(){
    return this.cart;
  }

  // ➕ Add
  addToCart(product: BaseItem) {
    const items = this.cart();
    const existing = items.find(p => p.id === product.id);

    if (existing) {
      this.cart.set(items.map(item =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      this.cart.set([...items, { ...product, qty: 1 }]);
    }
  }

  // ➕ Increase
  increase(product: BaseItem) {
    const items = this.cart();
    this.cart.set(items.map(item =>
      item.id === product.id ? { ...item, qty: item.qty + 1 } : item
    ));
  }

  // ➖ Decrease
  decrease(product: BaseItem) {
    this.cart.set(
      this.cart()
        .map(item => item.id === product.id ? { ...item, qty: item.qty - 1 } : item)
        .filter(item => item.qty > 0)
    );
  }

  // 🔍 Get Qty
  removeItem(id: number) {
    this.cart.set(this.cart().filter(item => item.id !== id));
  }

  clear() {
    this.cart.set([]);
  }

  getQty(product: BaseItem) {
    return this.qtyById().get(product.id) ?? 0;
  }

  // 🛒 Badge count
  cartCount = computed(() =>
    this.cart().reduce((sum, item) => sum + item.qty, 0)
  );

  subtotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.price * item.qty, 0)
  );

  deliveryFee = computed(() => (this.cart().length > 0 ? 4.99 : 0));

  tax = computed(() => this.subtotal() * 0.05);

  total = computed(() => this.subtotal() + this.deliveryFee() + this.tax());

}
