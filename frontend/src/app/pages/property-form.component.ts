import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyService } from '../core/property.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="container section narrow">
      <h2>{{ id ? 'Edit property' : 'Post a new property' }}</h2>
      <form #form="ngForm" class="panel form" (ngSubmit)="save()">
        <label>Title *
          <input class="input" name="title" [(ngModel)]="f.title" required placeholder="e.g. Spacious 3BHK apartment near the park" />
        </label>

        <div class="row">
          <label>Listing type
            <select class="input" name="listingType" [(ngModel)]="f.listingType">
              <option value="sale">For Sale</option><option value="rent">For Rent</option>
            </select>
          </label>
          <label>Property type
            <select class="input" name="type" [(ngModel)]="f.type">
              <option value="house">House</option><option value="apartment">Apartment</option>
              <option value="villa">Villa</option><option value="land">Land</option><option value="commercial">Commercial</option>
            </select>
          </label>
          <label>Price * {{ f.listingType === 'rent' ? '(per month)' : '' }}
            <input class="input" type="number" min="1" name="price" [(ngModel)]="f.price" required />
          </label>
        </div>

        <div class="row">
          <label>Bedrooms <input class="input" type="number" min="0" name="bedrooms" [(ngModel)]="f.bedrooms" /></label>
          <label>Bathrooms <input class="input" type="number" min="0" name="bathrooms" [(ngModel)]="f.bathrooms" /></label>
          <label>Area (sq ft) <input class="input" type="number" min="0" name="area" [(ngModel)]="f.area" /></label>
        </div>

        <div class="row">
          <label>City * <input class="input" name="city" [(ngModel)]="f.city" required /></label>
          <label>Address <input class="input" name="address" [(ngModel)]="f.address" /></label>
        </div>

        <label>Description
          <textarea class="input" rows="5" name="description" [(ngModel)]="f.description" placeholder="Describe the property, neighbourhood, nearby facilities…"></textarea>
        </label>

        <label>Image URLs <small class="muted">(one per line — first is the cover photo)</small>
          <textarea class="input" rows="3" name="images" [(ngModel)]="f.imagesText" placeholder="https://…"></textarea>
        </label>

        <label>Amenities <small class="muted">(comma separated)</small>
          <input class="input" name="amenities" [(ngModel)]="f.amenitiesText" placeholder="Parking, Gym, Garden, Pool" />
        </label>

        @if (error()) { <div class="alert">{{ error() }}</div> }

        <div class="actions">
          <a routerLink="/my-listings" class="btn btn-ghost">Cancel</a>
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Saving…' : id ? 'Save changes' : 'Publish listing' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class PropertyFormComponent implements OnInit {
  private api = inject(PropertyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = this.route.snapshot.paramMap.get('id');
  saving = signal(false);
  error = signal('');

  f: any = {
    title: '', listingType: 'sale', type: 'house', price: null, bedrooms: 0, bathrooms: 0,
    area: 0, city: '', address: '', description: '', imagesText: '', amenitiesText: '',
  };

  ngOnInit() {
    if (!this.id) return;
    this.api.get(this.id).subscribe((p) => {
      this.f = { ...p, imagesText: p.images.join('\n'), amenitiesText: p.amenities.join(', ') };
    });
  }

  save() {
    const payload = {
      ...this.f,
      images: String(this.f.imagesText || '').split('\n').map((s: string) => s.trim()).filter(Boolean),
      amenities: String(this.f.amenitiesText || '').split(',').map((s: string) => s.trim()).filter(Boolean),
    };
    this.saving.set(true);
    this.error.set('');
    const req = this.id ? this.api.update(this.id, payload) : this.api.create(payload);
    req.subscribe({
      next: (p) => this.router.navigate(['/property', p.id]),
      error: (e) => { this.error.set(e.error?.message || 'Could not save'); this.saving.set(false); },
    });
  }
}
