import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent }     from './app.component';
import { HomeComponent }    from './components/home/home.component';
import { MapComponent }     from './components/map/map.component';
import { RouterModule }     from '@angular/router';
import { NbThemeModule }    from '@nebular/theme';
import { HttpClientModule } from '@angular/common/http';
import { MarkerService }    from './services/marker.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    NbThemeModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    MarkerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
