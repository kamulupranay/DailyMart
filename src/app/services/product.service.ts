import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  _id: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:4000';

  getProducts(filters?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<{
    products: Product[];
    totalPages: number;
    currentPage: number;
    total: number;
  }> {
    let params = new HttpParams();

    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<{
      products: Product[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`${this.apiUrl}/products`, { params, withCredentials: true });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`, {
      withCredentials: true
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:4000';
  readonly cartCount = signal(0);

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/cart`, {
      withCredentials: true
    });
  }

  addToCart(productId: string, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(
      `${this.apiUrl}/cart`,
      { productId, quantity },
      { withCredentials: true }
    );
  }

  removeFromCart(productId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/cart/${productId}`, {
      withCredentials: true
    });
  }

  updateCartCount(count: number): void {
    this.cartCount.set(count);
  }
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:4000';

  createOrder(shippingAddress: any): Observable<Order> {
    return this.http.post<Order>(
      `${this.apiUrl}/orders`,
      { shippingAddress },
      { withCredentials: true }
    );
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`, {
      withCredentials: true
    });
  }
}