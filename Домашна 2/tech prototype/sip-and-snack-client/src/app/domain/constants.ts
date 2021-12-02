import * as Leaflet from 'leaflet';

export const ICON_RETINA_URL = 'assets/marker-icon-2x.png';
export const ICON_BLUE_URL = 'assets/map-marker-icon-blue.png';
export const ICON_RED_URL = 'assets/map-marker-icon-red.png';
export const SHADOW_URL = 'assets/marker-shadow.png';
export const ICON_DEFAULT = Leaflet.icon({
  iconRetinaUrl: ICON_RETINA_URL,
  iconUrl: ICON_BLUE_URL,
  iconSize: [30, 30],
  iconAnchor: [12, 30],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [30, 30]
});
export const ICON_DEFAULT_RED = Leaflet.icon({
  iconRetinaUrl: ICON_RETINA_URL,
  iconUrl: ICON_RED_URL,
  iconSize: [35, 35],
  iconAnchor: [12, 35],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [35, 435]
});
export const TILE_LAYER = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  minZoom: 8,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
