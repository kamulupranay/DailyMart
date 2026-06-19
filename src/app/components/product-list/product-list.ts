import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Product } from '../../services/product';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductModel } from '../../models/product.model';
import { map } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { Cart } from '../../services/cart';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { CurrencyPipe } from '@angular/common';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatListModule,
    CurrencyPipe
],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  private snackBar = inject(MatSnackBar);
  private productService = inject(Product);
  private cartService = inject(Cart);
  readonly skeletonCards = Array.from({ length: 8 });

  //Signal (correct way)
  readonly productList = toSignal<ProductModel[] | undefined>(
    this.productService.getProduct().pipe(
      map((products: ProductModel[]) =>
        products.map(product => ({
          id: product.id,
          title: product.title,
          image: product.image,
          category: product.category,
          description: product.description,
          price: product.price,
        } as ProductModel))
      )
    ),
    { initialValue: null }
  );

  // 🔍 Get Qty (connect to cart service)
  getQtys(product: ProductModel) {
    return this.cartService.getQty(product);
  }

  // ➕ Add
  addToCart(product: ProductModel) {
    this.cartService.addToCart(product);
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      duration: 3000,
      panelClass: ['custom-success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
      data: {
        message: `Item added successfully to cart!`,
        action: '<mat-icon>close</mat-icon>',
      },
    });
  }

  // ➕ Increase
  increase(product: ProductModel) {
    this.cartService.increase(product);
  }

  // ➖ Decrease
  decrease(product: ProductModel) {
    this.cartService.decrease(product);
  }

}
