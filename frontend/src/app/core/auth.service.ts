import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API } from './config';
import { User } from './models';

interface AuthResponse { token: string; user: User; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  user = signal<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));

  get token() { return localStorage.getItem('token'); }

  private save(r: AuthResponse) {
    localStorage.setItem('token', r.token);
    localStorage.setItem('user', JSON.stringify(r.user));
    this.user.set(r.user);
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${API}/auth/login`, { email, password }).pipe(tap((r) => this.save(r)));
  }

  register(data: { name: string; email: string; password: string; phone: string }) {
    return this.http.post<AuthResponse>(`${API}/auth/register`, data).pipe(tap((r) => this.save(r)));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.set(null);
    this.router.navigate(['/']);
  }
}
