import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

export class TimePickerTemplate {
  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#424242',
      buttonColor: '#fff'
    },
    dial: {
      dialBackgroundColor: '#555',
    },
    clockFace: {
      clockFaceBackgroundColor: '#555',
      clockHandColor: '#9fbd90',
      clockFaceTimeInactiveColor: '#fff'
    }
  };

  terniumTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#fff',
      buttonColor: '#000'
    },
  };

}
