import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule }                              from './app-routing.module';
import { AppComponent }                                  from './app.component';
import { MapComponent }                                  from './components/map/map.component';
import { RouterModule }                                  from '@angular/router';
import {
  NbAutocompleteModule,
  NbButtonGroupModule,
  NbButtonModule,
  NbContextMenuModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbMenuModule,
  NbMenuService,
  NbPopoverModule,
  NbSelectModule,
  NbSpinnerModule,
  NbThemeModule,
  NbToastrModule,
  NbWindowModule
}                                                        from '@nebular/theme';
import { NbEvaIconsModule }                              from '@nebular/eva-icons';
import { HttpClientModule }                              from '@angular/common/http';
import { MarkerService }                                 from './services/marker.service';
import { MapService }                                    from './services/map.service';
import { ReactiveFormsModule }                           from '@angular/forms';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
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
    NoopAnimationsModule,
    NbEvaIconsModule,
    NbIconModule,
    NbPopoverModule,
    NbMenuModule.forRoot(),
    NbContextMenuModule,
    NbAutocompleteModule,
    NbSpinnerModule
  ],
  providers: [
    MarkerService,
    MapService,
    NbMenuService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
