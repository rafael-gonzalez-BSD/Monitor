export function labelToGraphics(cadena: string) {
    let label = '';
    // tslint:disable-next-line: radix
    const mes = parseInt(cadena.substring(5, 7));
    // tslint:disable-next-line: radix
    const dia = parseInt(cadena.substring(8, 10));

    switch (mes) {
        case 1: label = 'Ene';
            break;
        case 2: label = 'Feb';
            break;
        case 3: label = 'Mar';
            break;
        case 4: label = 'Abr';
            break;
        case 5: label = 'May';
            break;
        case 6: label = 'Jun';
            break;
        case 7: label = 'Jul';
            break;
        case 8: label = 'Ago';
        break
        case 9: label = 'Sep';
            break;
        case 10: label = 'Oct';
            break;
        case 11: label = 'Nov';
            break;
        case 12: label = 'Dic';
        break

        default: label = '';
            break;
    }
    label = `${label} ${dia}`;

    return label;
}

export function convertFechaCintilla(cadena: string, tipoEntrada: string) {
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
        case 1: mesString = 'Ene';
            break;
        case 2: mesString = 'Feb';
            break;
        case 3: mesString = 'Mar';
            break;
        case 4: mesString = 'Abr';
            break;
        case 5: mesString = 'May';
            break;
        case 6: mesString = 'Jun';
            break;
        case 7: mesString = 'Jul';
            break;
        case 8: mesString = 'Ago';
        break
        case 9: mesString = 'Sep';
            break;
        case 10: mesString = 'Oct';
            break;
        case 11: mesString = 'Nov';
            break;
        case 12: mesString = 'Dic';
        break

        default: mesString = '';
            break;
    }

    if (tipoEntrada === 'MMYYYY') {
        label = `${mesString}/${anio}`;
        
    }else if(tipoEntrada === 'DDMMYYYY'){
        label = `${dia}/${mesString}/${anio}`;
    }
    else if(tipoEntrada === 'YYYYMMDD'){
        label = `${dia}/${mesString}/${anio}`;
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
