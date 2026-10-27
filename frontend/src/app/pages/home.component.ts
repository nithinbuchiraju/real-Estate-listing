import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Property } from '../core/models';
import { PropertyService } from '../core/property.service';
import { PropertyCardComponent } from '../shared/property-card.component';

const EMPTY = { q: '', listingType: '', type: '', beds: '', minPrice: '', maxPrice: '', sort: 'newest' };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, PropertyCardComponent],
  template: `
    <section class="hero">
      <div class="container">
        <h1>Find your next <span>dream home</span></h1>
        <p>Browse houses, apartments, villas and more — to buy or to rent.</p>

        <div class="search-box">
          <div class="tabs">
            <button [class.on]="f.listingType === ''" (click)="setTab('')">All</button>
            <button [class.on]="f.listingType === 'sale'" (click)="setTab('sale')">Buy</button>
            <button [class.on]="f.listingType === 'rent'" (click)="setTab('rent')">Rent</button>
          </div>
          <div class="search-row">
            <input class="input grow" placeholder="Search by city, area or keyword…" [(ngModel)]="f.q" (keyup.enter)="load()" name="q" />
            <button class="btn btn-primary" (click)="load()">Search</button>
          </div>
          <div class="filters">
            <select class="input" [(ngModel)]="f.type" (ngModelChange)="load()" name="type">
              <option value="">Any type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
            <select class="input" [(ngModel)]="f.beds" (ngModelChange)="load()" name="beds">
              <option value="">Any beds</option>
              <option value="1">1+ beds</option>
              <option value="2">2+ beds</option>
              <option value="3">3+ beds</option>
              <option value="4">4+ beds</option>
            </select>
            <input class="input" type="number" min="0" placeholder="Min price" [(ngModel)]="f.minPrice" (change)="load()" name="min" />
            <input class="input" type="number" min="0" placeholder="Max price" [(ngModel)]="f.maxPrice" (change)="load()" name="max" />
            <select class="input" [(ngModel)]="f.sort" (ngModelChange)="load()" name="sort">
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
            <button class="btn btn-ghost" (click)="reset()">Reset</button>
          </div>
        </div>
      </div>
    </section>

    <section class="container section">
      <div class="section-head">
        <h2>{{ f.listingType === 'rent' ? 'Properties for rent' : f.listingType === 'sale' ? 'Properties for sale' : 'All properties' }}</h2>
        <span class="muted">{{ items().length }} result{{ items().length === 1 ? '' : 's' }}</span>
      </div>

      @if (loading()) {
        <div class="grid">@for (i of [1,2,3,4,5,6]; track i) { <div class="skeleton"></div> }</div>
      } @else if (items().length === 0) {
        <div class="empty"><div class="empty-ico">🏚️</div><h3>No properties match your search</h3><p class="muted">Try changing or resetting the filters.</p></div>
      } @else {
        <div class="grid">
          @for (p of items(); track p.id) { <app-property-card [p]="p" /> }
        </div>
      }
    </section>
  `,
})
export class HomeComponent implements OnInit {
  private api = inject(PropertyService);
  items = signal<Property[]>([]);
  loading = signal(true);
  f = { ...EMPTY };

  ngOnInit() { this.load(); }

  setTab(t: string) { this.f.listingType = t; this.load(); }

  load() {
    this.loading.set(true);
    this.api.list(this.f).subscribe({
      next: (r) => { this.items.set(r); this.loading.set(false); },
      error: () => { this.items.set([]); this.loading.set(false); },
    });
  }

  reset() { this.f = { ...EMPTY }; this.load(); }
}
