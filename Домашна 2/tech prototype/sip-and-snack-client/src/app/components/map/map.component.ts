import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Leaflet                         from 'leaflet';
import { MarkerService }                    from '../../services/marker.service';
import { MOCK_BAR }                         from '../../domain/mock-data';
import { ICON_DEFAULT }                     from '../../domain/constants';
import { NbWindowService }                  from '@nebular/theme';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {

  private map;
  private layerGroup;
  userLocation: {lat: number, lon: number} | null = null;

  constructor(private markerService: MarkerService, private windowService: NbWindowService) { }

  ngOnInit(): void {

    Leaflet.Marker.prototype.options.icon = ICON_DEFAULT;
    this.getLocation()

  }

  ngAfterViewInit(): void {
    this.initMap()
    this.markerService.makeMarkers(this.layerGroup, MOCK_BAR)
    // this.layerGroup.clearLayers()
  }

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [ 41.724182, 21.774216 ],
      zoom: 8
    });

    this.layerGroup = Leaflet.layerGroup().addTo(this.map)

    const tiles = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 8,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  private getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            console.log("Latitude: " + position.coords.latitude +
              "Longitude: " + position.coords.longitude);
            this.userLocation = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            }
            console.log(this.userLocation)
            this.markerService.addMarker(this.map, this.userLocation.lat, this.userLocation.lon)
            this.map.setView([this.userLocation.lat, this.userLocation.lon], 12)
          }
        },
        (error) => console.log(error)
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

}
