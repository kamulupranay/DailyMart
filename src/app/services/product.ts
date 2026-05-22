import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { GroceriesModel } from '../models/grocery.model';
import { Observable, shareReplay } from 'rxjs';

interface GroceriesResponse {
  products: GroceriesModel[];
}
  
@Injectable({
  providedIn: 'root',
})
export class Product {
  private url = 'https://fakestoreapi.com/products';
  private groceriesUrl = 'https://dummyjson.com/products/category/groceries';
  private http = inject(HttpClient);
  private products$ = this.http.get<ProductModel[]>(this.url).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  private groceries$ = this.http.get<GroceriesResponse>(this.groceriesUrl).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  getProduct(): Observable<ProductModel[]>{
   return this.products$;
  }

  getGroceries(): Observable<GroceriesResponse>{
    return this.groceries$;
  }
}
