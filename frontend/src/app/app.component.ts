import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="nav">
      <div class="container nav-inner">
        <a routerLink="/" class="logo"><span class="logo-mark">⌂</span> HomeNest</a>
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Browse</a>
          @if (auth.user(); as u) {
            <a routerLink="/favorites" routerLinkActive="active">Favorites</a>
            <a routerLink="/my-listings" routerLinkActive="active">My Listings</a>
            <a routerLink="/add" class="btn btn-primary btn-sm">+ Post Property</a>
            <span class="avatar" [title]="u.name">{{ u.name.charAt(0).toUpperCase() }}</span>
            <button class="btn btn-ghost btn-sm" (click)="auth.logout()">Logout</button>
          } @else {
            <a routerLink="/login" routerLinkActive="active">Login</a>
            <a routerLink="/register" class="btn btn-primary btn-sm">Sign up</a>
          }
        </nav>
      </div>
    </header>
    <main><router-outlet /></main>
    <footer class="footer">
      <div class="container">© {{ year }} HomeNest · Find a place you'll love</div>
    </footer>
  `,
})
export class AppComponent {
  auth = inject(AuthService);
  year = new Date().getFullYear();
}
