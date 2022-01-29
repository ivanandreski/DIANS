import { AfterViewInit, Component, OnInit }                                          from '@angular/core';
import * as Leaflet                                                                  from 'leaflet';
import { MarkerService }                                                             from '../../services/marker.service';
import { ICON_DEFAULT, TILE_LAYER, TYPE_CONTEXT_ITEMS }                              from '../../domain/constants';
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

  form: FormGroup;
  travelKindIcon = 'walking';
  selectedTravelKind = 'foot-walking';
  isMobile = false;
  loadingSearch = false;
  loadingType = false;
  loadingPath = false;
  userLocation: MapLocation | null = null;
  selectedDestination: MapLocation | null = null;
  searchPlaces: MapItem[] = [];
  search$: Observable<MapItem[]>;
  typeContextItems = TYPE_CONTEXT_ITEMS;
  private map: Leaflet.Map;
  private markerLayer: Leaflet.LayerGroup;
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
            .subscribe(val => this.searchPlaces = val.slice(0, 10),
              () => this.loadingSearch = false);
        }
      });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.getLocation();
  }

  drawRoads() {
    this.loadingPath = true;
    this.mapService.getRoadLocations(this.userLocation!, this.selectedDestination!, this.form.value.travelKind)
      .subscribe(val => {
          this.roadLayer.clearLayers();
          const wayPoints = this.mapService.getRoads(val);
          const polyline = Leaflet.polyline(wayPoints, { color: '#3366ff', opacity: 1, weight: 3 });
          polyline.addTo(this.roadLayer);
          this.loadingPath = false;
        },
        () => {
          this.loadingPath = false;
          this.toastrService.danger('Something went wrong while retrieving path data!', 'Error', { position: NbGlobalPhysicalPosition.BOTTOM_RIGHT });
        });
  }

  onSelectType(type: string[]) {
    if (this.userLocation) this.getPlacesInRadius(type[0], this.userLocation);
    else this.getPlacesByType(type[0]);

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

  private getLocation() {
    this.mapService.getLocation()
      .subscribe(coords => {
        this.locationHandler(coords);
        this.map.setView([coords.latitude, coords.longitude], 12);
      });

    this.mapService.watchPosition()
      .subscribe(coords => {
        this.radiusLayer.clearLayers();
        this.locationHandler(coords);
      });
  }

  private getPlacesByType(type: string) {
    this.loadingType = true;
    this.apiService.getPlacesForType(type)
      .subscribe(it => {
        this.loadingType = false;
        this.makeMarkers(this.markerLayer, it);
      });
  }

  private getPlacesInRadius(type: string, location: MapLocation) {
    this.loadingType = true;
    this.apiService.getPlacesInRadius(type, location)
      .subscribe(it => {
        this.loadingType = false;
        this.makeMarkers(this.markerLayer, it);
      });
  }

  private locationHandler(coords: GeolocationCoordinates) {
    const lon = coords.longitude;
    const lat = coords.latitude;
    this.userLocation = { lat, lon };
    this.userLocationLayer.clearLayers();
    this.markerService.addMarker(this.userLocationLayer, lat, lon);
    Leaflet.circle([lat, lon], 10000, { color: 'lightskyblue' }).addTo(this.radiusLayer);
  }
}
