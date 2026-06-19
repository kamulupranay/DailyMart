import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { Product } from '../../services/product';
import { Cart } from '../../services/cart';
import { toSignal } from '@angular/core/rxjs-interop';
import { GroceriesModel } from '../../models/grocery.model';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar';
import { MatSnackBar } from '@angular/material/snack-bar';


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
   private snackBar = inject(MatSnackBar);
  readonly skeletonCards = Array.from({ length: 8 });

  //Signal (correct way)
  
readonly groceries: Signal<GroceriesModel[] | null> = toSignal(
    this.productService.getGroceries().pipe(
      map((res: { products: GroceriesModel[] }) => res.products
        .map((item: GroceriesModel) => {
          if (!item) {
            return null;
          }

          const grocery: GroceriesModel = {
            id: item.id,
            title: item.title,
            image: item.images?.[0] ?? item.images?.[0] ?? '', // Provide a default image if item.image is null
            category: item.category,
            description: item.description,
            price: item.price,
            images: []
          };
          console.log('Grocery:', grocery);

          return grocery;
        })
        .filter((g: GroceriesModel | null): g is GroceriesModel => !!g?.id)
      )
    ),
    { initialValue: null }
  );
 
  // 🔍 Get Qty (connect to cart service)
  getQtys(product: GroceriesModel) {
    return this.cartService.getQty(product);
  }

  // ➕ Add
  addToCart(product: GroceriesModel) {
    this.cartService.addToCart(product);
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
          duration: 3000,
          // panelClass: ['custom-success-snackbar'],
          data: {
            message: `${product.title} added to cart!`,
            action: '<mat-icon>close</mat-icon>',
          },
        });
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
