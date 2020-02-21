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
    const REG = /^(?:[1-9][0-9]*|0)$/;
 
    return (control: AbstractControl): ValidationErrors | null => {
        let VALOR  = '';
        if (control.value) {
            VALOR = control.value.toString();
        }else{
            return { inputNumber: true, message: `Campo requerido` }   
        }       
        

        if (VALOR === undefined) {
            return { inputNumber: true, message: `Campo requerido` }             
        }       
        if (required && VALOR.trim() === '') {
            return { inputNumber: true, message: `Campo requerido` }             
        }
        if (!required && VALOR.trim() === '') {
            return null;           
        }
        if(!(REG.test(VALOR.trim()))){
            return { inputNumber: true, message: `Solo números enteros mayor a 0` }
        }
        // tslint:disable-next-line: radix
        if( parseInt( VALOR ) < 1){
            return { inputNumber: true, message: `Solo números enteros mayor a 0` }
        }     
        return null;      
    }   
}