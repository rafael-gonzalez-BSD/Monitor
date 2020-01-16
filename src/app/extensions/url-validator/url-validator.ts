import { AbstractControl } from '@angular/forms';
export function checkIfUrlExists(control: AbstractControl) {
    if (control.value != null) {
        if (control.value == false || control.value == 'false') {
            return { notExist: true };
        }
    }
    return null;
}