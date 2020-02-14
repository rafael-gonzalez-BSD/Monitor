import moment from 'moment';

export function labelToGraphics(cadena: string) {
    let label = '';
    // tslint:disable-next-line: radix
    const mes = parseInt(cadena.substring(5, 7));
    // tslint:disable-next-line: radix
    const dia = parseInt(cadena.substring(8, 10));

    switch (mes) {
        case 1: label = 'ene.';
            break;
        case 2: label = 'feb.';
            break;
        case 3: label = 'mar.';
            break;
        case 4: label = 'abr.';
            break;
        case 5: label = 'may.';
            break;
        case 6: label = 'jun.';
            break;
        case 7: label = 'jul.';
            break;
        case 8: label = 'ago.';
        break
        case 9: label = 'sep';
            break;
        case 10: label = 'oct.';
            break;
        case 11: label = 'nov.';
            break;
        case 12: label = 'dic.';
        break

        default: label = '';
            break;
    }
    label = `${label} ${dia}`;

    return label;
}

export function convertFechaCintilla(cadena: string, tipoEntrada: string, tipoSalida: string) {
    // YYYY/MM/DD
    let mesString = '';
    let label = '';
    let dia: string;
    let mes: number;
    let anio: string;

    if (tipoEntrada === 'MMYYYY') {
        // tslint:disable-next-line: radix
        mes = parseInt(cadena.substring(0, 3));
        anio = cadena.substring(3, 8);
    }else if(tipoEntrada === 'DDMMYYYY'){
        // tslint:disable-next-line: radix
        mes = parseInt(cadena.substring(3, 5));
        anio = cadena.substring(6, 11);
        dia = cadena.substring(0, 2);
    }else if(tipoEntrada === 'YYYYMMDD'){
        // tslint:disable-next-line: radix
        mes = parseInt(cadena.substring(5, 7));
        anio = cadena.substring(0, 4);
        dia = cadena.substring(8, 10);
    }
    
    // tslint:disable-next-line: radix
     

    switch (mes) {
        case 1: mesString = 'ene.';
            break;
        case 2: mesString = 'feb.';
            break;
        case 3: mesString = 'mar.';
            break;
        case 4: mesString = 'abr.';
            break;
        case 5: mesString = 'may.';
            break;
        case 6: mesString = 'jun.';
            break;
        case 7: mesString = 'jul.';
            break;
        case 8: mesString = 'ago.';
        break
        case 9: mesString = 'sep';
            break;
        case 10: mesString = 'oct.';
            break;
        case 11: mesString = 'nov.';
            break;
        case 12: mesString = 'dic.';
        break

        default: mesString = '';
            break;
    }

    if (tipoEntrada === 'MMYYYY') {
        label = `${mesString}/${anio}`;
        
    }else if(tipoEntrada === 'DDMMYYYY'){
        label = `${dia}/${mesString}/${anio}`;
    }
    else if(tipoEntrada === 'YYYYMMDD' && tipoSalida === 'DDMMYYYY'){
        label = `${dia}/${mesString}/${anio}`;
    }
    else if(tipoEntrada === 'YYYYMMDD' && tipoSalida === 'MMMYYYY'){
        label = `${mesString}/${anio}`;
    }

    

    return label;
}

export function getStepSize(arreglo: any) {
    let max: number;
    let stepSize: number;
    max = Math.max(...arreglo);

    if (max > 0 && max <= 10) {
        stepSize = 1
    }else if(max>10 && max <= 100){
        stepSize = 10
    }
    else if(max>100 && max <= 500){
        stepSize = 50
    }
    else if(max>500){
        stepSize = 100
    }else{
        stepSize = 1;
    }
    

    return stepSize;
}

// Recibe una fecha del tipo yyyy/mm/dd y retorna una fecha del tipo dd/mm/yyyy
export function yyyymmddToddmmyyyy(cadena:string) {
    return `${cadena.substring(8, 10)}/${cadena.substring(5, 7)}/${cadena.substring(0, 4)}`;  
}

export function getFirstDayMonth(fecha: Date) {   
    
    let fechaString: string;
    const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    fechaString = moment( new Date(primerDia)).format('YYYY/MM/DD');
    return fechaString;
}

export function getLastDayMonth(fecha: Date, ) {
    let fechaString: string;
    const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
    fechaString = moment( new Date(ultimoDia)).format('YYYY/MM/DD');
    return fechaString;
}
