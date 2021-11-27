import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapItem }    from '../domain/map-item';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private http: HttpClient) { }

  popupInfo(mapItem: MapItem) {
    /** There really is not anything useful from this... */
    // this.http.get(`https://api.openstreetmap.org/api/0.6/node/${mapItem.id}`)
    //   .subscribe(res => {
    //     console.log(`get info for ${mapItem.id} ${mapItem.name}`)
    //     console.log(res)
    //   })
    return `
      <h1>${mapItem.name}</h1>
      <div>${mapItem.type}</div>
      <div>${mapItem.id}</div>
      <button (click)="console.log('hello')">click</button>
    `
  }
}
