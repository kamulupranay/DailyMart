import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) },
    { path: 'signup', loadComponent: () => import('./components/signup/signup').then(m => m.Signup) },
    { path: 'access-denied', loadComponent: () => import('./components/access-denied/access-denied').then(m => m.AccessDenied), canActivate: [AuthGuard] },
    { path: 'home', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard), canActivate: [AuthGuard], data: { roles: ['customer', 'admin'] } },
    { path: 'shopping', loadComponent: () => import('./components/product-list/product-list').then(m => m.ProductList), canActivate: [AuthGuard], data: { roles: ['customer'] } },
    { path: 'groceries', loadComponent: () => import('./components/groceries/groceries').then(m => m.Groceries), canActivate: [AuthGuard], data: { roles: ['customer'] } },
    { path: 'cart', loadComponent: () => import('./components/cart/cart').then(m => m.CartComponent), canActivate: [AuthGuard], data: { roles: ['customer'] } },
    { path: 'orders', loadComponent: () => import('./components/orders/orders').then(m => m.Orders), canActivate: [AuthGuard], data: { roles: ['customer'] } },
    { path: 'checkout', loadComponent: () => import('./components/checkout/checkout').then(m => m.Checkout), canActivate: [AuthGuard], data: { roles: ['customer'] } },
    { path: 'payment', loadComponent: () => import('./components/payment/payment').then(m => m.Payment), canActivate: [AuthGuard], data: { roles: ['customer'] } }
];
