import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { Product } from '../../services/product';
import { Cart } from '../../services/cart';
import { toSignal } from '@angular/core/rxjs-interop';
import { GroceriesModel } from '../../models/grocery.model';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-groceries',
  imports: [
    MatCardModule,
    MatButtonModule,
    CurrencyPipe
  ],
  templateUrl: './groceries.html',
  styleUrl: './groceries.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Groceries {
  private productService = inject(Product);
  private cartService = inject(Cart);
  readonly skeletonCards = Array.from({ length: 8 });

  //Signal (correct way)
  
readonly groceries: Signal<GroceriesModel[] | undefined> = toSignal(
  this.productService.getGroceries().pipe(
    map((res: any) => res.products.map((item: any)=> {
      if (!item) return null; 
      return new GroceriesModel(
          item.id,
          item.title,
          item.images?.[0],
          item.discount,
          item.price,
          item.category,
          item.description
        )
    }).filter((g: any) => g && g.id))
  ),
  { initialValue: undefined }
);

  // 🔍 Get Qty (connect to cart service)
  getQtys(product: GroceriesModel) {
    return this.cartService.getQty(product);
  }

  // ➕ Add
  addToCart(product: GroceriesModel) {
    this.cartService.addToCart(product);
  }

  // ➕ Increase
  increase(product: GroceriesModel) {
    this.cartService.increase(product);
  }

  // ➖ Decrease
  decrease(product: GroceriesModel) {
    this.cartService.decrease(product);
  }
}
