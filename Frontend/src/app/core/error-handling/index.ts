import {Injectable} from '@angular/core';
import {ErrorAction} from '../state/vehicle.actions';
import Swal from 'sweetalert2';
import { ErrorHandler } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  handleError(error) {
    console.error(error);
  }
}

export class ApiError extends Error{

    get message(): string
    {
      return this.httpError.message;
    }

    get status(): number
    {
      return this.httpError.status;
    }

    constructor(public httpError: HttpErrorResponse)
    {
      super(httpError.message);
    }
}
