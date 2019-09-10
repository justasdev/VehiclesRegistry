import {ApiResponseAction} from '../state/vehicle.actions';
import Swal from 'sweetalert2';

const DURATION = 3000;

export const notifyOnResponse = (response: ApiResponseAction, successMsg?: string, errorMsg?: string) =>
{
  console.log('API RESPONSE', response);
  if (response.error)
  {
    return Swal.fire({
      type: 'error',
      title: 'ERROR ' + (response.error.status ? ` ${response.error.status}` : ''),
      text: errorMsg || response.error.message,
      showConfirmButton: false,
      timer: DURATION
    });
  }else
  {
    return Swal.fire({
      type: 'success',
      text: successMsg || 'Success!',
      showConfirmButton: false,
      timer: 60000
    });
  }
};
