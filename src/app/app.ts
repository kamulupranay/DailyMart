import { Component, signal, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from "./layout/header/header.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('ecommerce');
  protected readonly showHeader = signal(true);
  private router = inject(Router);

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.url;
        this.showHeader.set(!url.includes('/login') && !url.includes('/signup'));
      });
  }
}
