import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { log } from 'util';

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

export function inputText(required: boolean, minLength: number, maxLength: number): ValidatorFn {
 
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

export function inputNumber(required: boolean, minLength: number, maxLength?: number): ValidatorFn {
 
    return (control: AbstractControl): ValidationErrors | null => {
        
        const VALOR: number = control.value;
        const VALORSTR: string = control.value;
        const test = (~~control.value === control.value); 
        console.log(test +'test');
        // tslint:disable-next-line: radix
        const V = parseInt(control.value);
        console.log(V);
        console.log(VALOR);
        if (required) {
            if (VALORSTR === null || VALORSTR === undefined || VALORSTR === '') {
                return { inputNumber: true, message: `Campo requerido` }            
            }
            // tslint:disable-next-line: radix
            
            if (VALOR<=0) {
                return { inputNumber: true, message: `Solo se aceptan números mayores a 0` }                
            }
            if (VALOR % 1 !== 0) {
                return { inputNumber: true, message: `Solo se aceptan números enteros` }                  
            }
            if(isNaN(VALOR)){
                return { inputNumber: true, message: `Solo se aceptan números` }

            }
            
            
        } else {
            // Si no es requerido
            
        }
        
        return null;      
    }
   
}