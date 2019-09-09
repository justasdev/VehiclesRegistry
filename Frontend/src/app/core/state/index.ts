import {
  Action,
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector, createReducer,
  createSelector,
  MetaReducer, on
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import {createEntityAdapter, Dictionary, EntityAdapter, EntityState} from '@ngrx/entity';
import {Vehicle} from '../models/vehicle';
import * as VehicleActions from './vehicle.actions';
import {PropsReturnType} from '@ngrx/store/src/models';

export interface State {
  vehiclesListState: VehicleListState
}



export interface VehicleListState extends EntityState<Vehicle>{
  selectedVehicleId: string
}

export const selectVehicleId = (v: Vehicle) => v.number;
export const vehicleAdapter: EntityAdapter<Vehicle> = createEntityAdapter<Vehicle>({selectId: selectVehicleId, sortComparer: false});

export const initialState: VehicleListState = vehicleAdapter.getInitialState({ids: [], entities: new class extends Dictionary<Vehicle> {}, selectedVehicleId: null});

export const vehiclesListReducer = createReducer(
  initialState,
  on(VehicleActions.apiResponse, (state, action) => {
    if (!!action.error) //Ignoring. Errors handled by callers.
    {
      return state;
    }
    switch (action.sourceAction.type) {
      case VehicleActions.loadVehicles.type: return vehicleAdapter.addAll(action.payload, state);
      case VehicleActions.updateVehicle.type: return  vehicleAdapter.updateOne({id: action.payload.number, changes: action.payload}, state);
      case VehicleActions.addVehicle.type: return vehicleAdapter.addOne(action.payload, state);
      case VehicleActions.deleteVehicle.type: return vehicleAdapter.removeOne(action.payload, state);
    }
  }),
);

export const {
  selectAll
} = vehicleAdapter.getSelectors();

export const vehiclesListFeatureSelector = createFeatureSelector('vehiclesListState');

export const allVehicles = createSelector(
  vehiclesListFeatureSelector,
  selectAll
);

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const reducers: ActionReducerMap<State> = {
  vehiclesListState: vehiclesListReducer
};
