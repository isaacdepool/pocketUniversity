import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(value: Date): unknown {
    value = new Date(value);
    let fecha = value.toISOString();
    let dia = fecha.toString();
    return moment(dia).format('DD MMMM YYYY, hh:mm a');
    
    
  }

}
