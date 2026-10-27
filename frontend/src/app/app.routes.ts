import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { HomeComponent } from './pages/home.component';
import { PropertyDetailComponent } from './pages/property-detail.component';
import { PropertyFormComponent } from './pages/property-form.component';
import { AuthComponent } from './pages/auth.component';
import { ListComponent } from './pages/list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'property/:id', component: PropertyDetailComponent },
  { path: 'login', component: AuthComponent, data: { mode: 'login' } },
  { path: 'register', component: AuthComponent, data: { mode: 'register' } },
  { path: 'add', component: PropertyFormComponent, canActivate: [authGuard] },
  { path: 'edit/:id', component: PropertyFormComponent, canActivate: [authGuard] },
  { path: 'my-listings', component: ListComponent, data: { mode: 'mine' }, canActivate: [authGuard] },
  { path: 'favorites', component: ListComponent, data: { mode: 'favorites' }, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
