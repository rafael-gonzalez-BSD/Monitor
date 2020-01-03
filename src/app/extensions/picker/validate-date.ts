import { AbstractControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

export function fromDateRequiredValidator(control: AbstractControl) {
  const valor: any = control.value;
  if (valor === null || valor === '' || valor === undefined) {
    return { requiredFromDate: true }
  }

  return null;
}

export function toDateRequiredValidator(control: AbstractControl) {
  const valor: any = control.value;
  if (valor === null || valor === '' || valor === undefined) {
    return { requiredToDate: true }
  }

  return null;
}

export function dateRangeValidator(formGroupValues: FormGroup) {
  const fechaDesde = formGroupValues.get('fechaDesde').value;
  const fechaHasta = formGroupValues.get('fechaHasta').value;

  if ((fechaDesde !== '' || moment.isMoment(fechaDesde)) && (fechaHasta !== '' || moment.isMoment(fechaHasta))) {
    if (fechaDesde.isAfter(fechaHasta)) {
      return { invalidDateRange: true };
    }
  }

  return null;
}

// import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
// export class AppCustomDirective extends Validators {

//   static fromDateValidator(fdValue: FormControl) {
//     debugger
//     const date = fdValue.value;
//     console.log('x');
//     if (date === null || date === '') return { requiredFromDate: true };

//   }

//   static toDateValidator(todValue: FormControl) {
//     debugger
//     const date = todValue.value;

//     if (date === null || date === '') return { requiredToDate: true };

//   }

//   // Not working
//   static timeValidator(formGroupValues: FormGroup): any {
//     debugger;
//     console.log(formGroupValues);
//     const fromDate = formGroupValues.get('FromDate').value;
//     const toDate = formGroupValues.get('ToDate').value;
//     const fromTime = formGroupValues.get('FromTime').value;
//     const toTime = formGroupValues.get('ToTime').value;

//     if (fromDate.toString() === toDate.toString()) {
//       let fromTimeArray = [];
//       let toTimeArray = [];
//       fromTimeArray = fromTime.split(':');
//       toTimeArray = toTime.split(':');
//       // tslint:disable-next-line: radix
//       if (parseInt(fromTime[0]) > parseInt(toTime[0])) {
//         alert('condition satisfied not return any error message');
//         return { InValidToTime: true };
//       }

//       if (
//         // tslint:disable-next-line: radix
//         parseInt(fromTimeArray[0]) === parseInt(toTimeArray[0]) &&
//         // tslint:disable-next-line: radix
//         parseInt(fromTimeArray[1]) > parseInt(toTimeArray[1])
//       ) {
//         alert('condition satisfied not return any error message')
//         return { InValidToTime: true };
//       }
//     }
//   }
// }
