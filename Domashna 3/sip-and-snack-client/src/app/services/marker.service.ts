import { Injectable }       from '@angular/core';
import * as Leaflet         from 'leaflet';
import { MapItem }          from '../domain/map-item';
import { ICON_DEFAULT_RED } from '../domain/constants';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor() {

  }

  addMarker(map: Leaflet.LayerGroup, lat: number, lon: number) {
    const marker = Leaflet.marker([lat, lon], { icon: ICON_DEFAULT_RED });
    marker.addTo(map);
  }

  popupInfo(mapItem: MapItem) {
    /** There really is not anything useful from this... */
    // this.http.get(`https://api.openstreetmap.org/api/0.6/node/${mapItem.id}`).subscribe((res: any) => {});
    return `
      <h1>${mapItem.name}</h1>
      <h3 style="text-align: center; text-transform: uppercase; color: #888">${mapItem.type}</h3>
    `;
  }
}
