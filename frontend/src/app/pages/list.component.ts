import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Property } from '../core/models';
import { PropertyService } from '../core/property.service';
import { PropertyCardComponent } from '../shared/property-card.component';

// One component for both "My Listings" and "Favorites" (chosen by route data)
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterLink, PropertyCardComponent],
  template: `
    <div class="container section">
      <div class="section-head">
        <h2>{{ mine ? 'My listings' : 'Saved properties' }}</h2>
        @if (mine) { <a routerLink="/add" class="btn btn-primary">+ Post Property</a> }
      </div>

      @if (!loading() && items().length === 0) {
        <div class="empty">
          <div class="empty-ico">{{ mine ? '📋' : '♡' }}</div>
          <h3>{{ mine ? "You haven't posted any property yet" : 'No saved properties yet' }}</h3>
          <a [routerLink]="mine ? '/add' : '/'" class="btn btn-primary">{{ mine ? 'Post your first property' : 'Browse listings' }}</a>
        </div>
      } @else {
        <div class="grid">
          @for (p of items(); track p.id) {
            <div>
              <app-property-card [p]="p" (favChanged)="onFav($event)" />
              @if (mine) {
                <div class="card-actions">
                  <a class="btn btn-outline btn-sm" [routerLink]="['/edit', p.id]">Edit</a>
                  <button class="btn btn-danger btn-sm" (click)="remove(p)">Delete</button>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ListComponent implements OnInit {
  private api = inject(PropertyService);
  mine = inject(ActivatedRoute).snapshot.data['mode'] === 'mine';
  items = signal<Property[]>([]);
  loading = signal(true);

  ngOnInit() {
    (this.mine ? this.api.mine() : this.api.favorites()).subscribe({
      next: (r) => { this.items.set(r); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onFav(p: Property) {
    if (!this.mine && !p.isFavorite) this.items.update((l) => l.filter((x) => x.id !== p.id));
  }

  remove(p: Property) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    this.api.remove(p.id).subscribe(() => this.items.update((l) => l.filter((x) => x.id !== p.id)));
  }
}
