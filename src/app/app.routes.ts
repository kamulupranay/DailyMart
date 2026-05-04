import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart';
import { ProductList } from './components/product-list/product-list';
import { Groceries } from './components/groceries/groceries';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'home', component: Dashboard, canActivate: [AuthGuard] },
    { path: 'shopping', component: ProductList, canActivate: [AuthGuard] },
    { path: 'groceries', component: Groceries, canActivate: [AuthGuard] },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard] }
];
