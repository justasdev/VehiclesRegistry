import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {VehiclesApiService} from '../api/vehicles-api.service';
import {
  addVehicle,
  apiResponse,
  deleteVehicle,
  loadVehicles,
  updateVehicle,
} from './vehicle.actions';
import {map, switchMap, tap} from 'rxjs/operators';
import {ApiError} from '../error-handling';

const makeApiResponse = (sourceAction, payload?) => map(res => apiResponse(sourceAction, res instanceof ApiError ? res : null, payload || res));

@Injectable()
export class AppEffects {

  loadVehicles$ = createEffect(() => this.actions$.pipe(
    ofType(loadVehicles.type),
    switchMap(() => this._vehiclesApi.loadVehicleOwners().pipe(makeApiResponse(loadVehicles)))
  ));

  addVehicle$ = createEffect(() => this.actions$.pipe(
    ofType(addVehicle.type),
    switchMap(({payload}) => this._vehiclesApi.addVehicle(payload).pipe(makeApiResponse(addVehicle, payload)))
  ));

  deleteVehicle$ = createEffect(() => this.actions$.pipe(
    ofType(deleteVehicle.type),
    switchMap(({payload}) => this._vehiclesApi.removeVehicle(payload).pipe(makeApiResponse(deleteVehicle, payload)))
  ));

  updateVehicle$ = createEffect(() => this.actions$.pipe(
    ofType(updateVehicle.type),
    switchMap(({payload}) => this._vehiclesApi.updateVehicle(payload).pipe(makeApiResponse(updateVehicle, payload)))
  ));

  constructor(public readonly actions$: Actions,
              private _vehiclesApi: VehiclesApiService) {

  }
}
