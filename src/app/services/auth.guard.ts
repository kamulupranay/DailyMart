import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService, UserRole } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.authService.checkSession().pipe(
      map((response) => {
        if (!response.user) {
          return this.router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url },
          });
        }

        const allowedRoles = route.data['roles'] as UserRole[] | undefined;
        if (!allowedRoles?.length || allowedRoles.includes(response.user.role)) {
          return true;
        }

        return this.router.createUrlTree(['/access-denied']);
      })
    );
  }
}
