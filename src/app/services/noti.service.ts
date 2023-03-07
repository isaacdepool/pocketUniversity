import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class NotiService {

  constructor( private noti: LocalNotifications) { }

  simpleNoti(id, title, coment){

    // Schedule a single notification
  this.noti.schedule({
  id: parseInt(id),
  title: title,
  text: coment,
  // sound: 'file://sound.mp3'|| 'file://beep.caf',
  data: { secret: 'key' }
});

  }

  notiEvent(id, title, coment, tipo, dia, mes, inicio, min){      
      
    this.noti.schedule({
      id: parseInt(id),
      title: 'Evento: ' + title,
      text: coment || 'Sin comentarios',
      trigger: { every: { month: parseInt(mes), day: parseInt(dia), hour: parseInt(inicio), minute: parseInt(min) }, count: 1 },
      foreground:true,
      data: { secret: 'secret' }

    });
  }

  notiClases(id, title, coment, dia, inicio, min){

    if( dia === 'lunes') {

      dia = 1;

    }else if( dia === 'martes') {

      dia = 2;

    }else if( dia === 'miércoles') {

      dia = 3;

    }else if( dia === 'jueves') {

      dia = 4;

    }else if( dia === 'viernes') {

      dia = 5;

    }else if( dia === 'sábado') {

      dia = 6;

    }else if( dia === 'domingo') {

      dia = 7;

    }

    this.noti.schedule({
      id: parseInt(id),
      title: 'Clases: ' + title,
      text: coment || 'Sin comentarios',
      trigger: { every: { weekday: dia, hour: parseInt(inicio), minute: parseInt(min) }, count: 1500 },
      foreground:true,
      // data: { secret: 'secret' }

    });

    
  }

  clearNoti( id ){

    this.noti.clear( parseInt(id) );
  }

}
