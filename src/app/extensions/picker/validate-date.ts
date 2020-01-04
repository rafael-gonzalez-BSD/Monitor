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

export function fromTimeRequiredValidator(control: AbstractControl) {
  const valor: any = control.value;
  if (valor === null || valor === '' || valor === undefined) {
    return { requiredFromTime: true }
  }
  return null;
}

export function toTimeRequiredValidator(control: AbstractControl) {
  const valor: any = control.value;
  if (valor === null || valor === '' || valor === undefined) {
    return { requiredToTime: true }
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

export function dateTimeRangeValidator(formGroupValues: FormGroup) {

  const fechaDesde = formGroupValues.get('fechaDesde').value;
  const fechaHasta = formGroupValues.get('fechaHasta').value;
  const horaDesde = formGroupValues.get('horaDesde').value;
  const horaHasta = formGroupValues.get('horaHasta').value;

  if ((fechaDesde !== '' || moment.isMoment(fechaDesde)) && (fechaHasta !== '' || moment.isMoment(fechaHasta))) {
    if (fechaDesde.isAfter(fechaHasta)) {
      return { invalidDateRange: true };
    }
    if (fechaDesde.isSame(fechaHasta)) {
      if (horaDesde !== '' && horaHasta !== '') {
        const totalMinutesFrom = moment.duration(horaDesde).asMinutes();
        const totalMinutesTo = moment.duration(horaHasta).asMinutes();

        if (totalMinutesFrom > totalMinutesTo) {
          return { invalidTimeRange: true };
        }
      }

    }
  }

  return null;
}

export function timeRangeValidator(formGroupValues: FormGroup) {

  const horaDesde = formGroupValues.get('horaDesde').value;
  const horaHasta = formGroupValues.get('horaHasta').value;

      if (horaDesde !== '' && horaHasta !== '') {
        const totalMinutesFrom = moment.duration(horaDesde).asMinutes();
        const totalMinutesTo = moment.duration(horaHasta).asMinutes();

        if (totalMinutesFrom >= totalMinutesTo) {
          return { invalidTimeRange: true };
        }
      }
  return null;
}
