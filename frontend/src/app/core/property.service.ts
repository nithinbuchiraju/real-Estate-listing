import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API } from './config';
import { Property } from './models';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private http = inject(HttpClient);
  private url = `${API}/properties`;

  list(filters: Record<string, string | number>) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) params = params.set(k, String(v));
    });
    return this.http.get<Property[]>(this.url, { params });
  }
  get(id: string) { return this.http.get<Property>(`${this.url}/${id}`); }
  mine() { return this.http.get<Property[]>(`${this.url}/mine`); }
  favorites() { return this.http.get<Property[]>(`${this.url}/favorites`); }
  create(p: Partial<Property>) { return this.http.post<Property>(this.url, p); }
  update(id: string, p: Partial<Property>) { return this.http.put<Property>(`${this.url}/${id}`, p); }
  remove(id: string) { return this.http.delete(`${this.url}/${id}`); }
  toggleFavorite(id: string) { return this.http.post<{ isFavorite: boolean }>(`${this.url}/${id}/favorite`, {}); }
}
