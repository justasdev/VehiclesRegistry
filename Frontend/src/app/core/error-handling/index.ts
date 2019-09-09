import {Injectable} from '@angular/core';
import {ErrorAction} from '../state/vehicle.actions';
import Swal from 'sweetalert2';
import { ErrorHandler } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  handleError(error) {
    console.error(error);
  }
}

export class ApiError extends Error{
    constructor(public message: string, public status: number)
    {
      super(message);
    }
}

//TODO: define global error handler

export const showError = (cause: ErrorAction) => {
  Swal.fire({
    type: 'error',
    title: 'ERROR',
    text: cause.error.message
  });
};
