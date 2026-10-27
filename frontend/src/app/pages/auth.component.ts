import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <form #form="ngForm" class="panel auth-card" (ngSubmit)="submit()">
        <div class="logo center"><span class="logo-mark">⌂</span> HomeNest</div>
        <h2>{{ isLogin ? 'Welcome back' : 'Create your account' }}</h2>
        <p class="muted center">{{ isLogin ? 'Log in to manage your listings and favorites.' : 'Post properties and save the ones you love.' }}</p>

        @if (!isLogin) {
          <label>Full name <input class="input" name="name" [(ngModel)]="d.name" required /></label>
          <label>Phone <input class="input" name="phone" [(ngModel)]="d.phone" placeholder="Shown to interested buyers" /></label>
        }
        <label>Email <input class="input" type="email" name="email" [(ngModel)]="d.email" required /></label>
        <label>Password <input class="input" type="password" name="password" [(ngModel)]="d.password" minlength="6" required /></label>

        @if (error()) { <div class="alert">{{ error() }}</div> }

        <button class="btn btn-primary block" type="submit" [disabled]="form.invalid || busy()">
          {{ busy() ? 'Please wait…' : isLogin ? 'Log in' : 'Sign up' }}
        </button>

        <p class="center muted">
          @if (isLogin) { New here? <a routerLink="/register" class="link">Create an account</a> }
          @else { Already registered? <a routerLink="/login" class="link">Log in</a> }
        </p>
        @if (isLogin) { <p class="center muted small">Demo: demo&#64;estate.com / demo123</p> }
      </form>
    </div>
  `,
})
export class AuthComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  isLogin = inject(ActivatedRoute).snapshot.data['mode'] === 'login';

  d = { name: '', phone: '', email: '', password: '' };
  busy = signal(false);
  error = signal('');

  submit() {
    this.busy.set(true);
    this.error.set('');
    const req = this.isLogin ? this.auth.login(this.d.email, this.d.password) : this.auth.register(this.d);
    req.subscribe({
      next: () => this.router.navigate(['/']),
      error: (e) => { this.error.set(e.error?.message || 'Something went wrong'); this.busy.set(false); },
    });
  }
}
