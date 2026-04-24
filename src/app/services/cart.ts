import { computed, Injectable, signal } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { GroceriesModel } from '../models/grocery.model';
import { BaseItem } from '../models/base.model';

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private cart = signal<(BaseItem & { qty: number })[]>([]);

  getCart(){
    return this.cart;
  }

  // ➕ Add
  addToCart(product: BaseItem) {
    const items = this.cart();
    const existing = items.find(p => p.id === product.id);

    if (existing) {
      existing.qty++;
      this.cart.set([...items]);
    } else {
      this.cart.set([...items, { ...product, qty: 1 }]);
    }
  }

  // ➕ Increase
  increase(product: BaseItem) {
    const items = this.cart();
    const item = items.find(p => p.id === product.id);

    if (item) {
      item.qty++;
      this.cart.set([...items]);
    }
  }

  // ➖ Decrease
  decrease(product: BaseItem) {
    const items = this.cart();
    const index = items.findIndex(p => p.id === product.id);

    if (index > -1) {
      items[index].qty--;

      if (items[index].qty === 0) {
        items.splice(index, 1);
      }

      this.cart.set([...items]);
    }
  }

  // 🔍 Get Qty
  getQty(product: BaseItem) {
    const item = this.cart().find(p => p.id === product.id);
    
    const check = item ? item.qty : 0;
    return check
  }

  // 🛒 Badge count
  cartCount = computed(() =>
    this.cart().reduce((sum, item) => sum + item.qty, 0)
  );

}
