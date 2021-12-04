import { AfterViewInit, Component, OnInit }          from '@angular/core';
import * as Leaflet                                  from 'leaflet';
import { MarkerService }                             from '../../services/marker.service';
import { ICON_DEFAULT, TILE_LAYER }                  from '../../domain/constants';
import { MapLocation }                               from '../../domain/map-location';
import { MapService }                                from '../../services/map.service';
import { MapItem }                                   from '../../domain/map-item';
import { FormControl, FormGroup }                    from '@angular/forms';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ApiService }                                from '../../services/api.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {

  userLocation: MapLocation | null = null;
  selectedDestination: MapLocation | null = null;
  form: FormGroup;
  selectedTravelKind = 'foot-walking';
  private map;
  private markerLayer;
  private roadLayer;
  private userLocationLayer;

  constructor(
    private markerService: MarkerService,
    private mapService: MapService,
    private toastrService: NbToastrService,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    Leaflet.Marker.prototype.options.icon = ICON_DEFAULT;
    this.form = new FormGroup({
      search: new FormControl(''),
      travelKind: new FormControl('')
    });

    this.form.get('travelKind')?.patchValue('foot-walking');
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.getLocation(this.map);
  }

  drawRoads() {
    this.mapService.getRoadLocations(this.userLocation!, this.selectedDestination!, this.form.value.travelKind)
      .subscribe((val: any) => {
          this.roadLayer.clearLayers();
          const wayPoints = this.mapService.getRoads(val);
          const polyline = Leaflet.polyline(wayPoints, { color: '#3366ff', opacity: 1, weight: 3 });
          polyline.addTo(this.roadLayer);
        },
        error => {
          this.toastrService.danger('Something went wrong while retrieving path data!', 'Error', { position: NbGlobalPhysicalPosition.BOTTOM_RIGHT });
        });
  }

  onSelectType(type: string[]) {
    if (this.userLocation) {
      this.getPlacesByTypeWithLocation(type[0], this.userLocation);
    }
    else {
      this.getPlacesByType(type[0]);
    }
  }

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [41.724182, 21.774216],
      zoom: 8
    });

    this.markerLayer = Leaflet.layerGroup().addTo(this.map);
    this.roadLayer = Leaflet.layerGroup().addTo(this.map);
    this.userLocationLayer = Leaflet.layerGroup().addTo(this.map);

    TILE_LAYER.addTo(this.map);
  }

  private makeMarkers(layerGroup: Leaflet.LayerGroup, items: MapItem[]) {
    for (const item of items) {
      const marker = Leaflet.marker([item.lat, item.lon]);

      marker.bindPopup(this.markerService.popupInfo(item));
      marker.on('click', () => {
        this.selectedDestination = { lat: item.lat, lon: item.lon };
      });
      marker.addTo(layerGroup);
    }
  }

  private getLocation(map: Leaflet.Map) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            const lon = position.coords.longitude;
            const lat = position.coords.latitude;
            this.userLocation = { lat, lon };
            this.userLocationLayer.clearLayers();
            this.markerService.addMarker(this.userLocationLayer, lat, lon);
            map.setView([lat, lon], 12);
          }
        },
        (error) => console.log(error)
      );

      navigator.geolocation.watchPosition(
        (position) => {
          if (position) {
            const lon = position.coords.longitude;
            const lat = position.coords.latitude;
            this.userLocation = { lat, lon };
            this.userLocationLayer.clearLayers();
            this.markerService.addMarker(this.userLocationLayer, lat, lon);
          }
        }
      );
    }
    else {
      alert('Browser doesn\'t support location.');
    }
  }

  private getPlacesByType(type: string) {
    this.apiService.getPlacesForType(type)
      .subscribe(it => {
        this.markerLayer.clearLayers();
        this.makeMarkers(this.markerLayer, it);
      });
  }

  private getPlacesByTypeWithLocation(type: string, location: MapLocation) {
    this.apiService.getPlacesForTypeWithLocation(type, location)
      .subscribe(it => {
        this.markerLayer.clearLayers();
        this.makeMarkers(this.markerLayer, it);
      });
  }
}
