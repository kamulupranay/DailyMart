import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart';
import { ProductList } from './components/product-list/product-list';
import { Groceries } from './components/groceries/groceries';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Dashboard },
    { path: 'shopping', component: ProductList },
    { path: 'groceries', component: Groceries },
    { path: 'cart', component: CartComponent }
    
];
