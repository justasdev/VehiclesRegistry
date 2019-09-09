import {ChangeDetectionStrategy, Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelect} from '@angular/material';
import {VehiclesApiService} from '../../../core/api/vehicles-api.service';
import {Vehicle} from '../../../core/models/vehicle';
import {Store} from '@ngrx/store';
import {State} from '../../../core/state';
import {addVehicle, ApiResponseAction, updateVehicle,} from '../../../core/state/vehicle.actions';
import {map, shareReplay, startWith, takeUntil} from 'rxjs/operators';
import {combineLatest, Observable, Subject} from 'rxjs';
import {API_RESPONSES} from '../../../core/api/response-handling';
import {notifyOnResponse} from '../../../core/notifying';

@Component({
  selector: 'add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddVehicleComponent implements OnInit {

  //Used for testing, since options are rendered in overlay container
  @ViewChild('modelSelect', {static: true, read: MatSelect}) _modelSelect: MatSelect;
  @ViewChild('makeSelect', {static: true, read: MatSelect}) _makeSelect: MatSelect;

  _newVehicleForm: FormGroup;
  _vehicle: Vehicle;

  _allModels$: Observable<string[]>;
  _selectedModel$ = new Subject<string>();
  _modelMakes$: Observable<string[]>;
  private _onDestroy$ = new Subject();
  private _waitingResponse = false;  //To not let user submit again while response not returned

  get _submitDisabled()
  {
    const val = this._newVehicleForm.value;
    const vehicle = this._vehicle;
    return this._newVehicleForm.invalid || this._newVehicleForm.status === 'PENDING'
              //Check if user tries to submit unchanged record
              || (vehicle && vehicle.model === val.model && vehicle.make === val.make && vehicle.owner === val.owner);
  }

  constructor(@Inject(MAT_DIALOG_DATA) @Optional() private _data: {vehicle?: Vehicle},
              private _dialogRef: MatDialogRef<AddVehicleComponent>,
              private _vehiclesApi: VehiclesApiService,
              private _store: Store<State>,
              @Inject(API_RESPONSES) private _apiResponses: Observable<ApiResponseAction>) {
              this._vehicle = _data ? _data.vehicle : null;
  }

  ngOnInit() {
    this._newVehicleForm = this._buildForm();
    const modelsWithMakes = this._vehiclesApi.loadAllModels().pipe(shareReplay(1));
    this._allModels$ = modelsWithMakes.pipe(map(mm => mm.map(vehicle => vehicle.model)));
    this._modelMakes$ = combineLatest(this._selectedModel$.pipe(startWith(this._vehicle ? this._vehicle.model : null)), modelsWithMakes).pipe(
      map(([selected, all]) => {const model = all.find(mm => mm.model === selected); return model ? model.makes : []}));

    this._apiResponses.pipe(
      takeUntil(this._onDestroy$),
    ).subscribe(action => {
      //Notifies user about success or failure.
      //In case of failure, error message from server is shown.
      if (action.sourceAction.type === addVehicle.type)
      {
        notifyOnResponse(action, 'Vehicle owner registered').then(() => this._dialogRef.close());
      }else if (action.sourceAction.type === updateVehicle.type)
      {
        notifyOnResponse(action, 'Vehicle owner updated').then(() => this._dialogRef.close());
      }
    });
  }

  private _buildForm(): FormGroup
  {
    return new FormGroup({
      number: new FormControl({value: this._vehicle ? this._vehicle.number : null, disabled: !!this._vehicle}, [Validators.required, Validators.pattern('[a-zA-Z]{3}[0-9]{3}')], this._validateNumberNotTaken.bind(this) ),
      owner: new FormControl(this._vehicle ? this._vehicle.owner : null, [Validators.required]),
      model: new FormControl(this._vehicle ? this._vehicle.model : null, [Validators.required]),
      make: new FormControl(this._vehicle ? this._vehicle.make : null, [Validators.required])
    });
  }

  _onSubmit(form: FormGroup)
  {
    if (form.valid && !this._waitingResponse)
    {
      this._waitingResponse = true;
      this._store.dispatch(this._vehicle ? updateVehicle({number: this._vehicle.number, ...form.value}) : addVehicle(form.value));
      this._dialogRef.close();
    }else
    {
      this._newVehicleForm.markAllAsTouched();
    }
  }

  _modelSelected(model: string)
  {
    this._selectedModel$.next(model);
  }

  private _validateNumberNotTaken(control: AbstractControl): Observable<null | {numberTaken: true}>
  {
    return this._vehiclesApi.validateNumberNotTaken(control.value).pipe(map(taken => taken ? {numberTaken: true} : null))
  }
}
