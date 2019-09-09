import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { AddVehicleComponent } from './add-vehicle.component';
import {MatDialogModule, MatDialogRef, MatFormFieldModule, MatInputModule, MatSelectModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from '../../../core/state';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {byCss, fillInput} from '../../../../test-helpers/helpers';
import {EMPTY, Observable, of} from 'rxjs';
import {DebugElement} from '@angular/core';
import {VehiclesApiService} from '../../../core/api/vehicles-api.service';
import {Vehicle} from '../../../core/models/vehicle';
import {EffectsModule} from '@ngrx/effects';
import {AppEffects} from '../../../core/state/app.effects';
import {API_RESPONSES} from '../../../core/api/response-handling';

const MODELS_MOCK = [{
  model: 'Audi',
  makes: ['A3', 'A4', 'A5']
}];

class VehiclesApiServiceMock
{
  public numberExists: boolean;

  public validateNumberNotTaken(number: string): Observable<boolean>
  {
    return of(this.numberExists);
  }

  public addVehicle(vehicle: Vehicle)
  {
    return of(true);
  }

  public loadAllModels()
  {
    return of(MODELS_MOCK);
  }
}

describe('AddVehicleComponent', () => {
  let component: AddVehicleComponent;
  let fixture: ComponentFixture<AddVehicleComponent>;
  let debugElement: DebugElement;
  let vehiclesApiService: VehiclesApiServiceMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
                BrowserModule,
                StoreModule.forRoot(reducers, {
                  metaReducers,
                  runtimeChecks: {
                    strictStateImmutability: true,
                    strictActionImmutability: true
                  }
                }),
                EffectsModule.forRoot([AppEffects]),
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatSelectModule,
                MatDialogModule,
                MatInputModule
      ],
      declarations: [ AddVehicleComponent ],
          providers: [{
            provide: VehiclesApiService, useClass: VehiclesApiServiceMock
          },
          {
            provide: MatDialogRef,  useValue: {close: () => {}}
          },
            {
              provide: API_RESPONSES, useValue: EMPTY
            }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVehicleComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    vehiclesApiService = <any>debugElement.injector.get(VehiclesApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('FormGroup should be created', function() {
    expect(component._newVehicleForm).toBeTruthy();
  });

  it('should test number required validators', () => {
    const vehicleForm = component._newVehicleForm;
    expect(vehicleForm.get('number').errors['required']).toBeTruthy();
    expect(vehicleForm.get('owner').errors['required']).toBeTruthy();
    expect(vehicleForm.get('model').errors['required']).toBeTruthy();
    expect(vehicleForm.get('make').errors['required']).toBeTruthy();
  });

  it('number pattern should be wrong', () => {
    const vehicleForm = component._newVehicleForm;
    const numberInput: HTMLInputElement = byCss(fixture,'input[formControlName=number]');
    fillInput(numberInput, 'sadsads');
    expect(vehicleForm.get('number').errors['pattern']).toBeTruthy();
  });

  it('validateNumberNotTaken should be called once', function() {
    const spy = spyOn(vehiclesApiService, 'validateNumberNotTaken').and.callThrough();
    const numberInput: HTMLInputElement = byCss(fixture,'input[formControlName=number]');
    fillInput(numberInput, 'aaa111');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('form should submit', async function() {
    const spy = spyOn(vehiclesApiService, 'addVehicle').and.callThrough();
    vehiclesApiService.numberExists = false;
    const val = {
      number: 'ttt555',
      owner: 'Test owner',
      model: MODELS_MOCK[0].model,
      make: MODELS_MOCK[0].makes[0]
    };
    fillInput(byCss(fixture,'input[formControlName=number]'), val.number);
    fillInput(byCss(fixture,'input[formControlName=owner]'), val.owner);
    byCss(fixture, 'mat-select[formControlName=model] .mat-select-trigger').click();
    fixture.detectChanges();
    await fixture.whenStable();
    const modelToSelect = component._modelSelect.options.toArray()[1];
    modelToSelect.select();
    component._modelSelected(modelToSelect.value);
    fixture.detectChanges();
    await fixture.whenStable();
    component._makeSelect.options.toArray()[1].select();
    fixture.detectChanges();
    await fixture.whenStable();
    byCss(fixture, 'button').click();
    expect(JSON.stringify(component._newVehicleForm.value)).toBe(JSON.stringify(val), 'Inputs of submitted form should be not changed');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  //TODO: add test to check if submit button is disabled until async validator returned
});
