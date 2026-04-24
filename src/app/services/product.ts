import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { GroceriesModel } from '../models/grocery.model';
import { Observable } from 'rxjs';
  
@Injectable({
  providedIn: 'root',
})
export class Product {
  private url = 'https://fakestoreapi.com/products';
  private groceriesUrl = 'https://dummyjson.com/products/category/groceries';
  private http = inject(HttpClient);

  getProduct(): Observable<ProductModel[]>{
   return this.http.get<ProductModel[]>(this.url);
  }

  getGroceries(): Observable<GroceriesModel[]>{
    return this.http.get<GroceriesModel[]>(this.groceriesUrl);
  }
}
