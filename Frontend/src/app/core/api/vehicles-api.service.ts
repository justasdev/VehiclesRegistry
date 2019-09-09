import { Injectable } from '@angular/core';
import {Observable, of, pipe} from 'rxjs';
import {ModelMakes, Vehicle} from '../models/vehicle';
import {delay, map, tap} from 'rxjs/operators';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VehiclesApiService {

  constructor(private _api: ApiService) { }

  public loadVehicleOwners(): Observable<Vehicle[]>
  {
    return this._api.get('vehicleOwners');
  }

  public validateNumberNotTaken(number: string): Observable<boolean>
  {
    return this._api.get('vehicles/exists/' + number);
  }

  public addVehicle(vehicle: Vehicle)
  {
    return this._api.post('vehicles/add', vehicle);
  }

  public removeVehicle(number: string): Observable<any>
  {
    return this._api.delete('vehicles/' + number).pipe(map(res => true));
  }

  public updateVehicle(vehicle: Vehicle): Observable<any>
  {
    return this._api.put('vehicles', vehicle);
  }

  public loadAllModels(): Observable<ModelMakes[]>
  {
    return this._api.get('models');
  }
}
