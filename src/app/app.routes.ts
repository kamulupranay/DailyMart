import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart';
import { ProductList } from './components/product-list/product-list';
import { Groceries } from './components/groceries/groceries';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { AuthGuard } from './services/auth.guard';
import { Checkout } from './components/checkout/checkout';
import { AccessDenied } from './components/access-denied/access-denied';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'access-denied', component: AccessDenied, canActivate: [AuthGuard] },
    { path: 'home', component: Dashboard, canActivate: [AuthGuard], data: { roles: ['customer', 'admin'] } },
    { path: 'shopping', component: ProductList, canActivate: [AuthGuard], data: { roles: ['customer'] } },
    { path: 'groceries', component: Groceries, canActivate: [AuthGuard], data: { roles: ['customer'] } },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard], data: { roles: ['customer'] } },
    { path: 'checkout', component: Checkout, canActivate: [AuthGuard], data: { roles: ['customer'] } }
];
