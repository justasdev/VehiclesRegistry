import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, InjectionToken, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {VehiclesListComponent} from './components/vehicles-list/vehicles-list.component';
import {VehiclesListViewComponent} from './components/vehicles-list/vehicles-list-view/vehicles-list-view.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ActionReducerMap, StoreModule} from '@ngrx/store';
import {metaReducers, reducers, State} from './core/state';
import {EffectsModule} from '@ngrx/effects';
import {AppEffects} from './core/state/app.effects';
import {enableProdMode} from '@angular/core';
import {
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AddVehicleComponent} from './components/vehicles-list/add-vehicle/add-vehicle.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {environment} from '../environments/environment';
import {API_RESPONSES, apiResponsesActionsFactory} from './core/api/response-handling';
import { LoaderCircleComponent } from './components/common/loader-circle/loader-circle.component';
import { LoaderComponent} from './components/common/loader/loader.component';
import {GlobalErrorHandler} from './core/error-handling';

if (environment.production)
{
  enableProdMode();
}

export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<State>>('root reducer');

@NgModule({
  declarations: [
    AppComponent,
    VehiclesListComponent,
    VehiclesListViewComponent,
    AddVehicleComponent,
    LoaderCircleComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NgxDatatableModule,
    HttpClientModule,
    StoreModule.forRoot(REDUCER_TOKEN, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    EffectsModule.forRoot([AppEffects]),
    MatTooltipModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatRippleModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  entryComponents: [AddVehicleComponent],
  providers: [
    {
      provide: API_RESPONSES,
      useFactory: apiResponsesActionsFactory,
      deps: [AppEffects]
    },
    {
      provide: ErrorHandler, useClass: GlobalErrorHandler
    },
    {
      provide: REDUCER_TOKEN, useValue: reducers
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
