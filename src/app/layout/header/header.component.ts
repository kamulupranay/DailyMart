import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { Cart } from '../../services/cart';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatBadgeModule,
    RouterLinkWithHref,
    RouterLinkActive
],
})
export class HeaderComponent {
  isMenuOpen = signal(false);
  isClosing = signal(false);
  private cartService = inject(Cart);
  private eRef = inject(ElementRef);
  cartCount = this.cartService.cartCount;
  private breakpointObserver = inject(BreakpointObserver);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  toggleMenu(){
    // event?.stopPropagation();
    // this.isMenuOpen.set(!this.isMenuOpen());
    if (this.isMenuOpen()) {
      this.isClosing.set(true);

      setTimeout(() => {
        this.isMenuOpen.set(false);
        this.isClosing.set(false);
      }, 300); // match animation duration
    } else {
      this.isMenuOpen.set(true);
    }
  }

  // ✅ Global click listener (works across all components)
  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isMenuOpen.set(false);
    }
  }
}
