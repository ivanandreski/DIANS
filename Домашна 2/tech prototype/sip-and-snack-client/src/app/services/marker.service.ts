import { Injectable }                    from '@angular/core';
import { HttpClient }                    from '@angular/common/http';
import * as Leaflet                      from 'leaflet';
import { MapItem }                       from '../domain/map-item';
import { PopupService }                  from './popup.service';
import { NbWindowService }               from '@nebular/theme';
import { ICON_DEFAULT_RED }              from '../domain/constants';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(private http: HttpClient, private popupService: PopupService, private windowService: NbWindowService) {

  }

  // TODO use the backend for sip & snack
  makeMarkers(map: Leaflet.LayerGroup, items: MapItem[]) {
    for (const item of items) {
      const marker = Leaflet.marker([item.lat, item.lon]);

      marker.bindPopup(this.popupService.popupInfo(item)).on('click', () => {
        console.log('hello')
        // this.http.get('https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624816ea72d64cbe432ab6493cde4f912432&start=8.681495,49.41461&end=8.687872,49.420318')
        //   .subscribe(response => console.log(response))
      })
      marker.addTo(map);
    }
  }

  addMarker(map: Leaflet.Map, lat: number, lon: number) {
    const marker = Leaflet.marker([lat, lon], {icon: ICON_DEFAULT_RED})
    marker.addTo(map)
  }
}
