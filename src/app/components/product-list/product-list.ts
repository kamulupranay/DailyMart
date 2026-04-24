import { Component, inject } from '@angular/core';
import { Product } from '../../services/product';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductModel } from '../../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { Cart } from '../../services/cart';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatSnackBarModule,
    CurrencyPipe
],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private snackBar = inject(MatSnackBar);
  private productService = inject(Product);
  private cartService = inject(Cart);

  //Signal (correct way)
  productList = toSignal<ProductModel[] | undefined>(
   this.productService.getProduct(),
    { initialValue: undefined }
  );

  // 🔍 Get Qty (connect to cart service)
  getQtys(product: ProductModel) {
    return this.cartService.getQty(product);
  }

  // ➕ Add
  addToCart(product: ProductModel) {
    this.cartService.addToCart(product);
    this.snackBar.open('Item added successfully!', '✖', {
    duration: 3000, // 3 seconds
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['success-snackbar']
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
