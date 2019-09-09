import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Vehicle} from '../../core/models/vehicle';
import {Store} from '@ngrx/store';
import {VehicleListState, allVehicles} from '../../core/state';
import {combineLatest, Observable, pipe, Subject} from 'rxjs';
import {ApiResponseAction, deleteVehicle, ErrorAction, loadVehicles, updateVehicle} from '../../core/state/vehicle.actions';
import {filter, map, startWith, takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {AddVehicleComponent} from './add-vehicle/add-vehicle.component';
import {VehiclesApiService} from '../../core/api/vehicles-api.service';
import Swal from 'sweetalert2';
import {API_RESPONSES} from '../../core/api/response-handling';
import {notifyOnResponse} from '../../core/notifying';

const vehicleContains = (val: string) => (vehicle: Vehicle) => {
  return vehicle.number.toLowerCase().indexOf(val) > -1 ||
    vehicle.owner.toLowerCase().indexOf(val) > -1 ||
    vehicle.model.toLowerCase().indexOf(val) > -1 ||
    vehicle.make.toLowerCase().indexOf(val) > -1;
};

@Component({
  selector: 'vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclesListComponent implements OnInit, OnDestroy {

  _vehicles$: Observable<Vehicle[]>;
  _searchValues$: Subject<string> = new Subject<string>();

  _processingVehicles = new Array<string>();
  _listLoading = true;

  private _onDestroy$ = new Subject();

  constructor(private _store: Store<VehicleListState>,
              private _vehiclesApi: VehiclesApiService,
              private _dialog: MatDialog,
              private _chg: ChangeDetectorRef,
              @Inject(API_RESPONSES) private _apiResponseActions$: Observable<ApiResponseAction>) {
  }

  ngOnInit() {
    this._vehicles$ = this._makeSearchableVehicles();

    this._store.dispatch(loadVehicles());

    this._apiResponseActions$.pipe(
      takeUntil(this._onDestroy$))
      .subscribe(res => {
        switch (res.sourceAction.type) {
          case loadVehicles.type:
            if (!!res.error)
            {
              notifyOnResponse(res);
            }
            this._listLoading = false;
            this._chg.detectChanges();
            break;
          case deleteVehicle.type:
            this._processingVehicles = this._processingVehicles.filter(v => v !== res.sourceAction.payload);
            if (!res.error)
            {
              notifyOnResponse(res, 'Vehicle deleted');
            }
            break;
        }
      });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }

  _addNewVehicle() {
    this._openVehicleForm();
  }

  _removeVehicle(vehicle: Vehicle) {
    this._processingVehicles.push(vehicle.number);
    this._chg.detectChanges();
    this._store.dispatch(deleteVehicle(vehicle.number));
  }

  _updateVehicle(vehicle: Vehicle) {
    this._openVehicleForm(vehicle);
  }

  private _openVehicleForm(vehicle?: Vehicle) {
    this._dialog.open(AddVehicleComponent, {disableClose: false, data: {vehicle: vehicle}});
  }

  private _makeSearchableVehicles() {
    return combineLatest(this._store.select(allVehicles),
      this._searchValues$.pipe(startWith(''), map(value => value ? value.toLowerCase() : '')))
      .pipe(map(([all, search]) => search.length > 0 ? all.filter(vehicleContains(search)) : all));
  }
}
