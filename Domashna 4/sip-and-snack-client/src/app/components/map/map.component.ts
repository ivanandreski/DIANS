import { AfterViewInit, Component, OnInit }                                          from '@angular/core';
import * as Leaflet                                                                  from 'leaflet';
import { MarkerService }                                                             from '../../services/marker.service';
import { ICON_DEFAULT, TILE_LAYER }                                                  from '../../domain/constants';
import { MapLocation }                                                               from '../../domain/map-location';
import { MapService }                                                                from '../../services/map.service';
import { MapItem }                                                                   from '../../domain/map-item';
import { FormControl, FormGroup }                                                    from '@angular/forms';
import { NbGlobalPhysicalPosition, NbIconLibraries, NbMenuService, NbToastrService } from '@nebular/theme';
import { ApiService }                                                                from '../../services/api.service';
import { DeviceDetectorService }                                                     from 'ngx-device-detector';
import { debounceTime, distinctUntilChanged, filter, map, Observable }               from 'rxjs';

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
  isMobile = false;
  travelKindIcon = 'walking';
  searchPlaces: MapItem[] = [];
  search$: Observable<MapItem[]>;
  typeContextItems = [
    { title: 'Bar', data: 'bar' },
    { title: 'Pub', data: 'pub' },
    { title: 'Cafe', data: 'cafe' },
    { title: 'Fast Food', data: 'fast_food' },
    { title: 'Restaurant', data: 'restaurant' }];
  private map;
  private markerLayer;
  private roadLayer;
  private userLocationLayer;
  private radiusLayer;

  constructor(
    private markerService: MarkerService,
    private mapService: MapService,
    private toastrService: NbToastrService,
    private apiService: ApiService,
    private deviceDetectorService: DeviceDetectorService,
    private iconLibraries: NbIconLibraries,
    private nbMenuService: NbMenuService
  ) {
  }

  ngOnInit(): void {
    Leaflet.Marker.prototype.options.icon = ICON_DEFAULT;
    this.form = new FormGroup({
      search: new FormControl(''),
      travelKind: new FormControl('')
    });

    this.form.get('travelKind')?.patchValue('foot-walking');
    this.isMobile = this.deviceDetectorService.isMobile() || this.deviceDetectorService.isTablet();
    this.iconLibraries.registerFontPack('font-awesome', { packClass: 'fas', iconClassPrefix: 'fa' });

    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'type-context-menu'),
        map(({ item: { title, data } }) => data),
      )
      .subscribe(data => this.onSelectType([data]));

    this.form.get('search')!.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(search => {
        if (search !== '' || search !== null) {
          this.apiService.getPlacesFromSearch(search)
            .subscribe((val) => {
              this.searchPlaces = val.slice(0, 10);
            });
        }
      });
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
      this.getPlacesInRadius(type[0], this.userLocation);
    }
    else {
      this.getPlacesByType(type[0]);
    }

    this.roadLayer.clearLayers();
  }

  onSelectTravelKind(kind: string) {
    this.travelKindIcon = kind;
  }

  onSearchItemClicked(item: MapItem) {
    if (item) {
      this.form.controls['search'].reset();
      this.makeMarkers(this.markerLayer, [item]);
      this.roadLayer.clearLayers();
      this.selectedDestination = { lat: item.lat, lon: item.lon };
      this.map.setView([item.lat, item.lon], 12);
    }
  }

  handleDisplay(str: any) {
    return typeof str === 'object' ? str.name : str;
  }

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [41.724182, 21.774216],
      zoom: 8
    });

    this.markerLayer = Leaflet.layerGroup().addTo(this.map);
    this.roadLayer = Leaflet.layerGroup().addTo(this.map);
    this.userLocationLayer = Leaflet.layerGroup().addTo(this.map);
    this.radiusLayer = Leaflet.layerGroup().addTo(this.map);

    TILE_LAYER.addTo(this.map);
  }

  private makeMarkers(layerGroup: Leaflet.LayerGroup, items: MapItem[]) {
    layerGroup.clearLayers();
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
            Leaflet.circle([lat, lon], 10000, { color: 'green' }).addTo(this.radiusLayer);
            map.setView([lat, lon], 12);
          }
        },
        (error) => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );

      navigator.geolocation.watchPosition(
        (position) => {
          if (position) {
            const lon = position.coords.longitude;
            const lat = position.coords.latitude;
            this.userLocation = { lat, lon };
            this.userLocationLayer.clearLayers();
            this.markerService.addMarker(this.userLocationLayer, lat, lon);
            this.radiusLayer.clearLayers();
            Leaflet.circle([lat, lon], 10000, { color: 'green' }).addTo(this.radiusLayer);
          }
        },
        (error) => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
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
        this.makeMarkers(this.markerLayer, it);
      });
  }

  private getPlacesInRadius(type: string, location: MapLocation) {
    this.apiService.getPlacesInRadius(type, location)
      .subscribe(it => {
        this.makeMarkers(this.markerLayer, it);
      });
  }
}
