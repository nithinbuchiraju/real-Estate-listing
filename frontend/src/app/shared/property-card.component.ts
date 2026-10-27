import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CurrencyPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Property } from '../core/models';
import { AuthService } from '../core/auth.service';
import { PropertyService } from '../core/property.service';
import { CURRENCY } from '../core/config';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DecimalPipe, TitleCasePipe],
  template: `
    <article class="card">
      <a [routerLink]="['/property', p.id]" class="card-img">
        @if (p.images[0]) { <img [src]="p.images[0]" [alt]="p.title" loading="lazy" (error)="imgErr($event)" /> }
        <span class="badge" [class.rent]="p.listingType === 'rent'">For {{ p.listingType === 'rent' ? 'Rent' : 'Sale' }}</span>
      </a>
      <button class="fav" [class.on]="p.isFavorite" (click)="toggleFav()" title="Save to favorites" aria-label="Favorite">
        {{ p.isFavorite ? '♥' : '♡' }}
      </button>
      <div class="card-body">
        <div class="price">
          {{ p.price | currency: currency : 'symbol' : '1.0-0' }}@if (p.listingType === 'rent') {<small>/mo</small>}
        </div>
        <a [routerLink]="['/property', p.id]" class="card-title">{{ p.title }}</a>
        <div class="muted">📍 {{ p.city }}@if (p.address) {, {{ p.address }}}</div>
        <div class="specs">
          @if (p.bedrooms) { <span>🛏 {{ p.bedrooms }} Beds</span> }
          @if (p.bathrooms) { <span>🛁 {{ p.bathrooms }} Baths</span> }
          <span>📐 {{ p.area | number }} sqft</span>
          <span class="tag">{{ p.type | titlecase }}</span>
        </div>
      </div>
    </article>
  `,
})
export class PropertyCardComponent {
  @Input({ required: true }) p!: Property;
  @Output() favChanged = new EventEmitter<Property>();

  currency = CURRENCY;
  private auth = inject(AuthService);
  private api = inject(PropertyService);
  private router = inject(Router);

  imgErr(e: Event) { (e.target as HTMLElement).style.display = 'none'; }

  toggleFav() {
    if (!this.auth.user()) { this.router.navigate(['/login']); return; }
    this.api.toggleFavorite(this.p.id).subscribe((r) => {
      this.p.isFavorite = r.isFavorite;
      this.favChanged.emit(this.p);
    });
  }
}
