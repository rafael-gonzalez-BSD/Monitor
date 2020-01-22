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
