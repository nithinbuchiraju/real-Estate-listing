import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Property } from '../core/models';
import { PropertyService } from '../core/property.service';
import { AuthService } from '../core/auth.service';
import { CURRENCY } from '../core/config';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DecimalPipe, DatePipe, TitleCasePipe],
  template: `
    <div class="container section">
      <a routerLink="/" class="back">← Back to listings</a>

      @if (error()) {
        <div class="empty"><div class="empty-ico">🔍</div><h3>{{ error() }}</h3></div>
      } @else {
       @if (p(); as p) {
        <div class="detail">
          <div class="detail-main">
            <div class="gallery">
              <div class="gallery-main">
                @if (p.images[sel()]) { <img [src]="p.images[sel()]" [alt]="p.title" (error)="imgErr($event)" /> }
                <span class="badge" [class.rent]="p.listingType === 'rent'">For {{ p.listingType === 'rent' ? 'Rent' : 'Sale' }}</span>
              </div>
              @if (p.images.length > 1) {
                <div class="thumbs">
                  @for (img of p.images; track $index) {
                    <img [src]="img" [class.on]="$index === sel()" (click)="sel.set($index)" alt="" />
                  }
                </div>
              }
            </div>

            <h1 class="detail-title">{{ p.title }}</h1>
            <div class="muted">📍 {{ p.address ? p.address + ', ' : '' }}{{ p.city }}</div>

            <div class="stats">
              <div><b>{{ p.bedrooms || '—' }}</b><span>Bedrooms</span></div>
              <div><b>{{ p.bathrooms || '—' }}</b><span>Bathrooms</span></div>
              <div><b>{{ p.area | number }}</b><span>Sq ft</span></div>
              <div><b>{{ p.type | titlecase }}</b><span>Type</span></div>
            </div>

            <h3>About this property</h3>
            <p class="desc">{{ p.description || 'No description provided.' }}</p>

            @if (p.amenities.length) {
              <h3>Amenities</h3>
              <div class="chips">@for (a of p.amenities; track a) { <span class="chip">✓ {{ a }}</span> }</div>
            }
          </div>

          <aside class="detail-side">
            <div class="panel">
              <div class="price big">
                {{ p.price | currency: currency : 'symbol' : '1.0-0' }}@if (p.listingType === 'rent') {<small>/mo</small>}
              </div>
              <button class="btn btn-outline block" (click)="toggleFav()">{{ p.isFavorite ? '♥ Saved' : '♡ Save property' }}</button>
              <hr />
              <h4>Contact owner</h4>
              <div class="owner">
                <span class="avatar lg">{{ p.ownerName.charAt(0).toUpperCase() }}</span>
                <div><b>{{ p.ownerName }}</b><div class="muted small">Listed {{ p.createdAt | date: 'mediumDate' }}</div></div>
              </div>
              @if (p.ownerPhone) { <a class="btn btn-primary block" [href]="'tel:' + p.ownerPhone">📞 {{ p.ownerPhone }}</a> }
              <a class="btn btn-ghost block" [href]="'mailto:' + p.ownerEmail + '?subject=Enquiry: ' + p.title">✉ Email owner</a>

              @if (auth.user()?.id === p.ownerId) {
                <hr />
                <a class="btn btn-outline block" [routerLink]="['/edit', p.id]">✎ Edit listing</a>
                <button class="btn btn-danger block" (click)="remove()">🗑 Delete listing</button>
              }
            </div>
          </aside>
        </div>
       } @else {
        <div class="skeleton tall"></div>
       }
      }
    </div>
  `,
})
export class PropertyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(PropertyService);
  auth = inject(AuthService);

  p = signal<Property | null>(null);
  error = signal('');
  sel = signal(0);
  currency = CURRENCY;

  ngOnInit() {
    this.api.get(this.route.snapshot.paramMap.get('id')!).subscribe({
      next: (r) => this.p.set(r),
      error: () => this.error.set('Property not found'),
    });
  }

  imgErr(e: Event) { (e.target as HTMLElement).style.display = 'none'; }

  toggleFav() {
    if (!this.auth.user()) { this.router.navigate(['/login']); return; }
    const p = this.p()!;
    this.api.toggleFavorite(p.id).subscribe((r) => this.p.set({ ...p, isFavorite: r.isFavorite }));
  }

  remove() {
    if (!confirm('Delete this listing permanently?')) return;
    this.api.remove(this.p()!.id).subscribe(() => this.router.navigate(['/my-listings']));
  }
}
