import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'hora'
})
export class HoraPipe implements PipeTransform {

  transform(value: Date): unknown {
    value = new Date(value);
    let fecha = value.toISOString();
    let dia = fecha.toString();
    return moment(dia).format('hh:mm a');
    
    
  }

}
