import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

// tslint:disable-next-line: function-name
export function TrimValidation(control: AbstractControl) {
    const valor: any = control.value;
    if (valor === null || valor === undefined) {
        return { requiredTrim: true }
    }
    if(valor.trim() === '') {
        return { requiredTrim: true }
    }

    if (valor.trim().length < 3 ) {
        return { minLengthTrim: true }
    } 
    
    if (valor.trim().length > 100 ) {
        return { maxLengthTrim: true }
    } 
  return null;
}

export function inputText(required: boolean, minLength: number, maxLength): ValidatorFn {
 
    return (control: AbstractControl): ValidationErrors | null => {
        const VALOR: string = control.value;
        if (required) {
            if (VALOR === null || VALOR === undefined) {
                return { inputText: true, message: `Campo requerido` }            
            }
            if (VALOR.trim() === '') {
                return { inputText: true, message: `Campo requerido` }            
            }
            if ( VALOR.trim().length > 0 && VALOR.trim().length < minLength) {
                return { inputText: true, message: `Mínimo ${minLength} caracteres` }            
            }
    
            if (VALOR.trim().length > maxLength) {
                return { inputText: true, message: `Máximo ${maxLength} caracteres` }            
            }
            
        } else {
            if (VALOR  || VALOR !== undefined) {
                if ( VALOR.trim().length > 0 && VALOR.trim().length < minLength) {
                    return { inputText: true, message: `Mínimo ${minLength} caracteres` }            
                }
        
                if (VALOR.trim().length > maxLength) {
                    return { inputText: true, message: `Máximo ${maxLength} caracteres` }            
                }
                     
            }
            
        }                      
        

         
        
        
        return null;      
    }
   
  }
