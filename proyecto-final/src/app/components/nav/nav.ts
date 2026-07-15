import { Component, input, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss'
})
export class Nav {
  scrolled = input<boolean>(false);
  open = signal(false);
  currentUrl = signal('/');

  private router = inject(Router);
  auth = inject(AuthService);

  constructor() {
    // Track active route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl.set(event.urlAfterRedirects);
    });
  }

  toggleOpen() {
    this.open.update(v => !v);
  }

  closeMenu() {
    this.open.set(false);
  }

  logout() {
    this.auth.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }

  isActive(url: string): boolean {
    if (url === '/') {
      return this.currentUrl() === '/' || this.currentUrl() === '';
    }
    return this.currentUrl().startsWith(url);
  }
}
