import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dia'
})
export class DiaPipe implements PipeTransform {

  transform(value: Date, valid: string): unknown {

    if( (valid === 'lunes') || (valid === 'martes') || (valid === 'miércoles') || (valid === 'jueves') || (valid === 'viernes') || (valid === 'sábado') || (valid === 'domingo') ){

      return valid;

    }else{
    value = new Date(value);
    let fecha = value.toISOString();
    let dia = fecha.toString();
    return moment(dia).format('DD MMMM YYYY');
    }
    
  }

}
