import { AbstractControl } from '@angular/forms';
export function checkIfUrlExists(control: AbstractControl) {
    console.log(control.value + ' - ' + new Date().toDateString());
    if (control.value !== null && control.value !== "" && control.value !== undefined) {        
        if (control.value == false || control.value == 'false') {
            return { notExist: true };
        }
    }
    return null;
}