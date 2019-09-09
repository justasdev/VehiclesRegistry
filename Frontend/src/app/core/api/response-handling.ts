import {InjectionToken} from '@angular/core';
import {Observable, pipe} from 'rxjs';
import {apiResponse, ApiResponseAction, AppAction} from '../state/vehicle.actions';
import {ofType} from '@ngrx/effects';
import {AppEffects} from '../state/app.effects';
import {filter} from 'rxjs/operators';

export const apiResponsesActionsFactory = (effects: AppEffects) => effects.actions$.pipe(ofType(apiResponse.type));

export const forSource = (...actions) => {
  return filter((a: AppAction) => !!(<ApiResponseAction[]>actions).find(action => action.sourceAction.type === a.type));
};

export const API_RESPONSES = new InjectionToken<Observable<ApiResponseAction>>('API_RESPONSES');

