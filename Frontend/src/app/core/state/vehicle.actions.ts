import {Action, createAction} from '@ngrx/store';
import {Vehicle} from '../models/vehicle';

export interface AppAction extends Action{
  payload: any
}

export interface ErrorAction{
  error: Error,
  sourceAction: AppAction
}

export interface ApiResponseAction{
  sourceAction: AppAction,
  error?: Error,
  payload?: any,
}

export const apiResponse = createAction('[Vehicles/API] RESPONSE', (sourceAction: AppAction, error?: Error, payload?: any) => ({sourceAction, error, payload}));
export const apiError = createAction('[Vehicles/API] ERROR', (error: Error, sourceAction: AppAction) => ({error, sourceAction}));
export const loadVehicles = createAction('[Vehicles/API] Load Vehicles');
export const vehiclesLoaded = createAction('[Vehicles/API] Vehicles loaded', (payload: Vehicle[]) => ({payload}));
export const vehicleSelected = createAction('[Vehicles/UI] Vehicle selected', (payload: Vehicle) => ({payload}));
export const addVehicle = createAction('[Vehicles/API] Add vehicle', (payload: Vehicle) => ({payload}));
export const vehicleAdded = createAction('[Vehicles/API] Vehicle added', (payload: Vehicle) => ({payload}));
export const deleteVehicle = createAction('[Vehicles/API] Delete vehicle', (payload: string) => ({payload}));
export const vehicleDeleted = createAction('[Vehicles/API] Vehicle deleted', (payload: string) => ({payload}));
export const updateVehicle = createAction('[Vehicles/API] Update vehicle', (payload: Vehicle) => ({payload}));
export const vehicleUpdated = createAction('[Vehicles/API] Vehicle updated', (payload: Vehicle) => ({payload}));

