import { Injectable }       from '@angular/core';
import { LatLngExpression } from 'leaflet';
import { MapLocation }      from '../domain/map-location';
import { HttpClient }       from '@angular/common/http';
import { Observable }       from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) {
  }

  getRoadLocations(userLocation: MapLocation, placeLocation: MapLocation, profile: string) {
    return this.http.get(
      `https://api.openrouteservice.org/v2/directions/${profile}?api_key=5b3ce3597851110001cf624816ea72d64cbe432ab6493cde4f912432&start=${userLocation.lon},${userLocation.lat}&end=${placeLocation.lon},${placeLocation.lat}`
    );
  }

  getRoads(initialResponse: any) {
    if (initialResponse.features.length > 0) {
      const wayPoints: LatLngExpression[][] = [];
      for (const wayPoint of initialResponse.features[0].geometry.coordinates) {
        wayPoints.push(wayPoint);
      }
      return wayPoints.map(it => it.reverse());
    }

    return [];
  }

  getLocation() {
    return new Observable<GeolocationCoordinates>((observer) => {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position.coords);
          observer.complete();
        },
        (err) => observer.error(err)
      );
    });
  }

  watchPosition() {
    return new Observable<GeolocationCoordinates>((observer) => {
      window.navigator.geolocation.watchPosition(
        (position) => {
          observer.next(position.coords);
          observer.complete();
        },
        (err) => observer.error(err)
      );
    });
  }
}
