import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule }                              from './app-routing.module';
import { AppComponent }                                  from './app.component';
import { HomeComponent }                                 from './components/home/home.component';
import { MapComponent }                                  from './components/map/map.component';
import { RouterModule }                                  from '@angular/router';
import {
  NbButtonGroupModule,
  NbButtonModule,
  NbInputModule,
  NbLayoutModule,
  NbSelectModule,
  NbThemeModule,
  NbToastrModule,
  NbWindowModule
}                                                        from '@nebular/theme';
import { HttpClientModule }                              from '@angular/common/http';
import { MarkerService }                                 from './services/marker.service';
import { MapService }                                    from './services/map.service';
import { ReactiveFormsModule }                           from '@angular/forms';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    NbThemeModule.forRoot(),
    HttpClientModule,
    NbWindowModule.forChild(),
    NbLayoutModule,
    NbInputModule,
    ReactiveFormsModule,
    NbButtonGroupModule,
    NbButtonModule,
    NbSelectModule,
    NbToastrModule.forRoot(),
    BrowserAnimationsModule,
    NoopAnimationsModule
  ],
  providers: [
    MarkerService,
    MapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
