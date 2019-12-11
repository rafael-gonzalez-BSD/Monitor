import { AbstractControl } from '@angular/forms';

// tslint:disable-next-line: function-name
export function RequireMatch(control: AbstractControl) {
  const selection: any = control.value;
  if (typeof selection === 'string') {
    return { incorrect: true };
  }
  return null;
}
