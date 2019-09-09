import {Action, createAction} from '@ngrx/store';
import {Vehicle} from '../models/vehicle';
import {ApiError} from '../error-handling';

export interface AppAction extends Action{
  payload: any
}

export interface ErrorAction{
  error: Error,
  sourceAction: AppAction
}

export interface ApiResponseAction{
  sourceAction: AppAction,
  error?: ApiError,
  payload?: any,
}

export const apiResponse = createAction('[Vehicles/API] RESPONSE', (sourceAction: AppAction, error?: Error, payload?: any) => ({sourceAction, error, payload}));
export const loadVehicles = createAction('[Vehicles/API] Load Vehicles');
export const addVehicle = createAction('[Vehicles/API] Add vehicle', (payload: Vehicle) => ({payload}));
export const deleteVehicle = createAction('[Vehicles/API] Delete vehicle', (payload: string) => ({payload}));
export const updateVehicle = createAction('[Vehicles/API] Update vehicle', (payload: Vehicle) => ({payload}));
