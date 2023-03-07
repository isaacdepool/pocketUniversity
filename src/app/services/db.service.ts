import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { Dev, event, cuaderno, materia, carpeta } from '../interfaces/interfaces';
import { GaleriaService } from './galeria.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
 
  usuario = new BehaviorSubject([]);
  materias = new BehaviorSubject([]);
  evento = new BehaviorSubject([]);
  evento2 = new BehaviorSubject([]);
  periodo = new BehaviorSubject([]);
  cuaderno = new BehaviorSubject([]);
  fotos = new BehaviorSubject([]);
  carpeta = new BehaviorSubject([]);
  archivos = new BehaviorSubject([]);
  finanzas = new BehaviorSubject([]);
  config = new BehaviorSubject([]);
  config2 = new BehaviorSubject([]);

  id_materia = 0;
  public id_evento = 0;
  id_cuaderno = 0;
  id_carpeta = 0;
 
  constructor( private platform: Platform, 
               private sqlitePorter: SQLitePorter, 
               private sqlite: SQLite, 
               private http: HttpClient) {


//Abrir BDD      
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'ionic.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
      });
    });
  }
 
  seedDatabase() {
    this.http.get('/assets/data/base.sql', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
          this.cargarUsuario();
          this.cargarMaterias();
          this.cargarEvento();
          this.cargarEvento2();
          this.cargarPeriodo();
          this.cargarCuaderno();
          this.cargarFotos();
          this.cargarCarpeta();
          this.cargarArchivo();
          this.cargarFinanzas();
          this.cargarConfig();
          this.cargarConfig2();
          this.dbReady.next(true);
        })
        .catch(e => console.error(e));
    });
  }
 
  getDatabaseState() {
    return this.dbReady.asObservable();
  }
 
  getUser(): Observable<Dev[]> {
    return this.usuario.asObservable();
  }
 
  getMaterias(): Observable<any[]> {
    return this.materias.asObservable();
  }

  getEvento(): Observable<any[]> {
    return this.evento.asObservable();
  }

  getEvento2(): Observable<any[]> {
    return this.evento2.asObservable();
  }

  getPeriodo(): Observable<any[]> {
    return this.periodo.asObservable();
  }

  getCuaderno(): Observable<any[]> {
    return this.cuaderno.asObservable();
  }

  getFotos(): Observable<any[]> {
    return this.fotos.asObservable();
  }

  getCarpeta(): Observable<any[]> {
    return this.carpeta.asObservable();
  }

  getArchivo(): Observable<any[]> {
    return this.archivos.asObservable();
  }

  getGasto(): Observable<any[]> {
    return this.finanzas.asObservable();
  }

  getConfig(): Observable<any[]> {
    return this.config.asObservable();
  }

  getConfig2(): Observable<any[]> {
    return this.config2.asObservable();
  }


// CRUD Usuario   
cargarUsuario() {
  return this.database.executeSql('SELECT * FROM usuario', []).then(data => {
    let usuarios: Dev[] = [];

    if (data.rows.length > 0) {
      for (var i = 0; i < data.rows.length; i++) {

        usuarios.push({ 
          id: data.rows.item(i).id,
          nombre: data.rows.item(i).nombre, 
          apellido: data.rows.item(i).apellido, 
          avatar: data.rows.item(i).avatar
         });
      }
    }
    this.usuario.next(usuarios);
  });
}


agregarUsuario(name, apellido, avatar) {
  let data = [name, apellido, avatar];
  return this.database.executeSql('INSERT INTO usuario (nombre, apellido, avatar) VALUES (?, ?, ?)', data).then(data => {
    this.cargarUsuario();
  });
}

getUsuario(id): Promise<Dev> {
  return this.database.executeSql('SELECT * FROM usuario WHERE id = ?', [id]).then(data => {

    return {
      id: data.rows.item(0).id,
      nombre: data.rows.item(0).nombre, 
      apellido: data.rows.item(0).apellido, 
      avatar: data.rows.item(0).avatar
    }
  });
}

eliminarUsuario(id) {
  return this.database.executeSql('DELETE FROM usuario WHERE id = ?', [id])
        .then(_ => {
    this.cargarUsuario();
    this.cargarMaterias();
  });
}

updateUsuario(dev: Dev) {
  let data = [dev.nombre, dev.apellido , dev.avatar];
  return this.database.executeSql(`UPDATE usuario SET nombre = ?, apellido = ?, avatar = ? WHERE id = ${dev.id}`, data).then(data => {
    this.cargarUsuario();
  })
}

// CRUD Materias
cargarMaterias() {
  let query = 'SELECT materias.nombre, materias.id, id_usuario, id_periodo, id_evento, usuario.nombre AS usuario FROM materias JOIN usuario ON usuario.id = materias.id_usuario';
  return this.database.executeSql(query, [])
            .then(data => {

    let materias = [];

    if (data.rows.length > 0) {
      for (var i = 0; i < data.rows.length; i++) {
        
        materias.push({ 
          nombre: data.rows.item(i).nombre,
          id: data.rows.item(i).id,
          id_usuario: data.rows.item(i).id_usuario,
          id_periodo: data.rows.item(i).id_periodo,
          id_evento: data.rows.item(i).id_evento,
          usuario: data.rows.item(i).usuario,
        });
        this.id_materia = data.rows.item(i).id;
      }
    }
    this.materias.next(materias);
    return this.id_materia;
  });
}

cargarMateriaId(id): Promise<materia>{
  return this.database.executeSql('SELECT * FROM materias WHERE id = ?', [id])
        .then( data => {
          return {
            id: data.rows.item(0).id,
            nombre: data.rows.item(0).nombre, 
            id_usuario: data.rows.item(0).id_usuario, 
            id_periodo: data.rows.item(0).id_periodo, 
            id_evento: data.rows.item(0).id_evento,

          }

        });
}

cargarMateriaPeriodo(id){
  return this.database.executeSql('SELECT * FROM materias WHERE id_periodo = ?', [id])
        .then( data => { 
        
          let materias = [];
          
          if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {        
 
          materias.push({
            id: data.rows.item(i).id,
            nombre: data.rows.item(i).nombre, 
            id_usuario: data.rows.item(i).id_usuario, 
            id_periodo: data.rows.item(i).id_periodo, 
            id_evento: data.rows.item(i).id_evento,

          });
        }
      }
      
      return materias;
    }); 
}

cargarMateriaEvento(id){
  return this.database.executeSql('SELECT * FROM materias WHERE id_evento = ?', [id])
        .then( data => { 
        
          let materias = [];
          
          if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {        

          materias.push({
            id: data.rows.item(i).id,
            nombre: data.rows.item(i).nombre, 
            id_usuario: data.rows.item(i).id_usuario, 
            id_periodo: data.rows.item(i).id_periodo, 
            id_evento: data.rows.item(i).id_evento,

          });
        }
      }
      
      return materias;
    }); 
}

agregarMaterias(nombre, id_usuario, id_periodo, id_evento) {
  let data = [nombre, id_usuario, id_periodo, id_evento];
  return this.database.executeSql('INSERT INTO materias (nombre, id_usuario, id_periodo, id_evento) VALUES (?, ?, ?, ?)', data).
              then( _ => {
                      this.cargarMaterias();
                      return this.id_materia + 1;
              });
}

updateMaterias(id, nombre, id_periodo, id_evento){
  let data = [nombre, id_periodo, id_evento];
  return this.database.executeSql(`UPDATE materias SET nombre = ?, id_periodo = ?, id_evento = ? WHERE id = ${id}`, data)
          .then( _ => {
                this.cargarMaterias();
          });

}

eliminarMateriasPeriodo(id){
  return this.database.executeSql('DELETE FROM materias WHERE id_periodo = ?', [id])
        .then( _ => {
          this.cargarMaterias();
        });
}

eliminarMaterias(id){
  return this.database.executeSql('DELETE FROM materias WHERE id = ?', [id])
        .then( _ => {
          this.cargarMaterias();
        });
}


//CRUD EVENTO 
cargarEvento(){
  let query = 'SELECT evento.id, evento.nombre, evento.dia, evento.inicio, evento.fin, evento.tipo, evento.comentario, evento.id_usuario FROM evento JOIN usuario ON usuario.id = evento.id_usuario';
  return this.database.executeSql(query, [])
            .then( data => {

          let evento = [];
            
          if( data.rows.length > 0 ){
            for( var i = 0; i < data.rows.length; i++ ){

              evento.push({

                id: data.rows.item(i).id,
                nombre: data.rows.item(i).nombre,
                dia: data.rows.item(i).dia,
                inicio: data.rows.item(i).inicio,
                fin: data.rows.item(i).fin,
                tipo: data.rows.item(i).tipo,
                comentario: data.rows.item(i).comentario,
                id_usuario: data.rows.item(i).id_usuario,
                // usuario: data.rows.item(i).usuario,

              });
              this.id_evento = data.rows.item(i).id
            }
          }
          this.evento.next(evento);
          
            });
}

cargarEvento2(){
  let query = 'SELECT * FROM evento';
  return this.database.executeSql(query, [])
            .then( data => {

          let evento = [];
            
          if( data.rows.length > 0 ){
            for( var i = 0; i < data.rows.length; i++ ){

              evento.push({

                id: data.rows.item(i).id,
                nombre: data.rows.item(i).nombre,
                dia: data.rows.item(i).dia,
                inicio: data.rows.item(i).inicio,
                fin: data.rows.item(i).fin,
                tipo: data.rows.item(i).tipo,
                comentario: data.rows.item(i).comentario,
                id_usuario: data.rows.item(i).id_usuario,

              });
            }
          }
          this.evento2.next(evento);
          
            });
}

agregarEvento(nombre, dia, inicio, fin, tipo, comentario, id_usuario){
    let data = [nombre, dia, inicio, fin, tipo, comentario, id_usuario];
    return this.database.executeSql('INSERT INTO evento (nombre, dia, inicio, fin, tipo, comentario, id_usuario) VALUES (?,?,?,?,?,?,?)', data)
                  .then( data => {
                      this.cargarEvento();
                      this.cargarEvento2();

                      // return this.id_evento;
                  });
}

cargarEventoId(id): Promise<event>{
  return this.database.executeSql('SELECT * FROM evento WHERE id = ?', [id])
        .then( data => {
          return {
            id: data.rows.item(0).id,
            nombre: data.rows.item(0).nombre, 
            dia: data.rows.item(0).dia, 
            inicio: data.rows.item(0).inicio, 
            fin: data.rows.item(0).fin, 
            tipo: data.rows.item(0).tipo,
            comentario: data.rows.item(0).comentario,
            id_usuario: data.rows.item(0).id_usuario
          }
        })
}

eliminarEvento(id: number){
  return this.database.executeSql( 'DELETE FROM evento WHERE id = ?', [id] )
        .then( _ => {
          this.cargarEvento();
          this.cargarEvento2();
        });
}

updateEvento( id, nombre, dia, inicio, fin, tipo, comentario ){
    let data = [nombre, dia, inicio, fin, tipo, comentario];
    return this.database.executeSql (`UPDATE evento SET nombre = ?, dia = ?, inicio = ?, fin = ?, tipo = ?, comentario = ? WHERE id = ${id}`, data)
            .then( data => {
                this.cargarEvento();
                this.cargarEvento2();
            });
          }
          
// CRUD Periodo
cargarPeriodo(){
            
    let query = 'SELECT periodo.id, periodo.nombre, periodo.id_usuario, usuario.nombre AS usuario FROM periodo JOIN usuario ON usuario.id = periodo.id_usuario';
      return this.database.executeSql(query, [])
            .then( data => {
              
              let periodo = [];
            
              if( data.rows.length > 0 ){
                for( var i = 0; i < data.rows.length; i++ ){
                  
                  periodo.push({

                    id: data.rows.item(i).id,
                    nombre: data.rows.item(i).nombre,
                    id_usuario: data.rows.item(i).id_usuario,
                    usuario: data.rows.item(i).usuario,
                    
                  });
                }
          }
          this.periodo.next(periodo);
          
        });
        
      }
cargarPeriodoId(id): Promise<any> {
  return this.database.executeSql('SELECT * FROM periodo WHERE id = ?', [id])
          .then( data => {
        return {
          id: data.rows.item(0).id,
          nombre: data.rows.item(0).nombre,
          id_usuario: data.rows.item(0).id_usuario,
        } 
          });

}
      
agregarPeriodo(nombre, id_usuario){
  let data = [nombre, id_usuario];
  return this.database.executeSql('INSERT INTO periodo (nombre, id_usuario) VALUES (?,?)', data)
          .then( _ => {
            this.cargarPeriodo();
          });
}

updatePeriodo(id, nombre){
  let data = [nombre];
  return this.database.executeSql(`UPDATE periodo SET nombre = ? WHERE id = ${id}`, data).
          then( _ => {
            this.cargarPeriodo();
          })
}

eliminarPeriodo(id){
  return this.database.executeSql('DELETE FROM periodo WHERE id = ?', [id])
            .then( _ => {
              this.cargarPeriodo();
            })
}

// CRUD Cuaderno

cargarCuaderno(){
  let query = 'SELECT * FROM cuaderno'
           return this.database.executeSql(query, [])
               .then( data =>{ 
                 let cuaderno = [];

                   if(data.rows.length > 0){
                     for( var i = 0; i < data.rows.length; i++ ){
                        
                      cuaderno.push({

                        id: data.rows.item(i).id,
                        titulo: data.rows.item(i).titulo,
                        fecha_crea: data.rows.item(i).fecha_crea,
                        fecha_mod: data.rows.item(i).fecha_mod,
                        contenido: data.rows.item(i).contenido,
                        id_usuario: data.rows.item(i).id_usuario,
                        id_materia: data.rows.item(i).id_materia
                      });
                      this.id_cuaderno = data.rows.item(i).id;
                     }
                   }
                   
              this.cuaderno.next(cuaderno);
               });


}

cargarCuadernoId(id): Promise<cuaderno>{
  return this.database.executeSql('SELECT * FROM cuaderno WHERE id = ?', [id])
        .then( data => {
          return {
            id: data.rows.item(0).id,
            titulo: data.rows.item(0).titulo, 
            fecha_crea: data.rows.item(0).fecha_crea,
            fecha_mod: data.rows.item(0).fecha_mod, 
            contenido: data.rows.item(0).contenido, 
            id_usuario: data.rows.item(0).id_usuario,
            id_materia: data.rows.item(0).id_materia,
          }
        });
}

agregarCuaderno(titulo, fecha_crea, fecha_mod, contenido, id_materia){
  let data = [titulo, fecha_crea, fecha_mod, contenido, id_materia];
  return this.database.executeSql('INSERT INTO cuaderno (titulo, fecha_crea, fecha_mod, contenido, id_materia) values (?,?,?,?,?)', data)
          .then( _ => {
            this.cargarCuaderno();
            return this.id_cuaderno + 1;
          });

}

updateCuaderno(id,titulo, fecha_crea, fecha_mod, contenido, id_materia){
  let data = [titulo,  fecha_crea, fecha_mod, contenido, id_materia];
  return this.database.executeSql(`UPDATE cuaderno SET titulo = ?, fecha_crea = ?, fecha_mod = ?, contenido = ?, id_materia = ? WHERE id = ${id}`, data)
          .then( _ =>{
              this.cargarCuaderno();
          });
}

eliminarCuaderno(id){
  return this.database.executeSql('DELETE FROM cuaderno WHERE id = ?', [id])
        .then( _ =>{
          this.cargarCuaderno();
        });
}

eliminarCuadernoPeriodo(id){
  return this.database.executeSql('DELETE FROM cuaderno WHERE id_materia = ?', [id])
        .then( _ =>{
          this.cargarCuaderno();
        });
}

// CRUD Fotos
cargarFotos(){
  let query = 'SELECT * FROM fotos';
  return this.database.executeSql(query, [])
      .then( data =>{
        let fotos = [];

        if(data.rows.length > 0){
          for( var i = 0; i < data.rows.length; i++ ){
             
           fotos.push({

             id: data.rows.item(i).id,
             nombre: data.rows.item(i).nombre,
             url: data.rows.item(i).url,
             fecha: data.rows.item(i).fecha,
             favorito: data.rows.item(i).favorito,
             id_carpeta: data.rows.item(i).id_carpeta,
             id_usuario: data.rows.item(i).id_usuario,
           });
          }
        }
        this.fotos.next(fotos); 

      });
}

agregarFotos(nombre, url, fecha, id_carpeta, id_usuario){
  let data = [nombre, url, fecha, 0, id_carpeta, id_usuario];
return this.database.executeSql('INSERT INTO fotos (nombre, url, fecha, favorito, id_carpeta, id_usuario) values (?,?,?,?,?,?)', data) 
        .then( _ =>{
          this.cargarFotos();
        });
}

eliminarFotos(id){
       
return this.database.executeSql('DELETE FROM fotos WHERE id = ?', [id])
.then( _ =>{    
  this.cargarFotos();
});
}

updateFotosFav(id, fav){
let data = [fav];
return this.database.executeSql(`UPDATE fotos SET favorito = ? WHERE id = ${id}`, data)

    .then( data =>{
      
      this.cargarFotos();        
    });

}

eliminarFotosCarpeta(id){
       
return this.database.executeSql('DELETE FROM fotos WHERE id_carpeta = ?', [id])
.then( _ =>{    
  this.cargarFotos();
});
}

// CRUD Carpeta 
cargarCarpeta(){
  let query = 'SELECT * FROM carpeta'
  return this.database.executeSql(query, [])
        .then( data =>{

          let carpetas = [];

        if(data.rows.length > 0){
          for( var i = 0; i < data.rows.length; i++ ){
             
           carpetas.push({

             id: data.rows.item(i).id,
             nombre: data.rows.item(i).nombre,
             id_usuario: data.rows.item(i).id_usuario,
             id_materia: data.rows.item(i).id_materia,
           });
           this.id_carpeta = data.rows.item(i).id;
          }
        }
        
   this.carpeta.next(carpetas);
        });
}

cargarCarpetaId(id): Promise<carpeta>{
  return this.database.executeSql('SELECT * FROM carpeta WHERE id = ?', [id])
        .then( data => {
          return {
            id: data.rows.item(0).id,
             nombre: data.rows.item(0).nombre,
             id_usuario: data.rows.item(0).id_usuario,
             id_materia: data.rows.item(0).id_materia,
          }
        });
}

agregarCarpeta(nombre, id_usuario, id_materia){
  let data = [nombre, id_usuario, id_materia];
  return this.database.executeSql('INSERT INTO carpeta (nombre, id_usuario, id_materia) VALUES (?,?,?)', data)
          .then( _ =>{
              this.cargarCarpeta();
              return this.id_carpeta + 1;
          });
}

agregarCarpetaPreder(){
  let id = 1;
  let nombre = 'Otros';
  let data = [id, nombre];
  return this.database.executeSql(`INSERT INTO carpeta (id, nombre) VALUES (?,?)`, data)
          .then( _ =>{
              this.cargarCarpeta();
          });
}

eliminarCarpeta(id){
  return this.database.executeSql('DELETE FROM carpeta WHERE id = ?', [id])
          .then( _ =>{
            this.cargarCarpeta();
          });
}

updateCarpeta(id, nombre){
  let data = [nombre];
  return this.database.executeSql(`UPDATE carpeta SET nombre = ? WHERE id_materia = ${id}`, data)
          .then( _ =>{
              this.cargarCarpeta();
          });
}

updateCarpetaLibre(id, nombre){
  let data = [nombre];
  return this.database.executeSql(`UPDATE carpeta SET nombre = ? WHERE id = ${id}`, data)
          .then( _ =>{
              this.cargarCarpeta();
          });
}

// CRUD Archivos 
cargarArchivo(){
  let query = 'SELECT * FROM archivos';
  return this.database.executeSql(query, [])
        .then( data =>{
            
          let archivos = [];
        
        if(data.rows.length > 0){
          for( var i = 0; i < data.rows.length; i++){

            archivos.push({
              
              id: data.rows.item(i).id,
              nombre: data.rows.item(i).nombre,
              url: data.rows.item(i).url,
              id_usuario: data.rows.item(i).id_usuario,
              id_cuaderno: data.rows.item(i).id_cuaderno,
            });
          }
        }
      this.archivos.next(archivos);
        });
}

agregarArchivos(url, nombre, id_usuario, id_cuaderno){
  let data = [url, nombre, id_usuario, id_cuaderno];
  return this.database.executeSql('INSERT INTO archivos (url, nombre, id_usuario, id_cuaderno) VALUES (?,?,?,?)', data)
          .then( _ =>{
            this.cargarArchivo();
          });
}

updateArchivo(nombre, url, id_cuaderno){

  let data = [nombre, url];
  return this.database.executeSql(`UPDATE archivos SET nombre = ?, url = ? WHERE id_cuaderno = ${id_cuaderno}`, data)
          .then( _ =>{
              this.cargarArchivo();
          });
}

cargarArchivosCuaderno(id){
  return this.database.executeSql('SELECT * FROM archivos WHERE id_cuaderno = ?', [id])
        .then( data =>{
          let archivos = [];
        
          if(data.rows.length > 0){
            for( var i = 0; i < data.rows.length; i++){

              archivos.push({
                
                id: data.rows.item(i).id,
                nombre: data.rows.item(i).nombre,
                url: data.rows.item(i).url,
              });
            }
          }
          return archivos;
        });
}

eliminarArchivoCuaderno(id){
  return this.database.executeSql('DELETE FROM archivos WHERE id_cuaderno = ?', [id])
        .then( _ =>{
          this.cargarArchivo();
        });
}

eliminarArchivo(id){
  return this.database.executeSql('DELETE FROM archivos WHERE id = ?', [id])
        .then( _ =>{
          this.cargarArchivo();
        });
}

// CRUD Finanzas

cargarFinanzas(){
              
  let query = 'SELECT * FROM finanzas';
  return this.database.executeSql(query, [])
          .then( data => {

            let finanzas = [];

            if( data.rows.length > 0 ){
              for( var i = 0; i < data.rows.length; i++ ){
          
                finanzas.push({

                  id: data.rows.item(i).id,
        gasto: data.rows.item(i).gasto,
        tipo_gasto: data.rows.item(i).tipo_gasto,
        descripcion: data.rows.item(i).descripcion,
        fecha: data.rows.item(i).fecha,
        icono: data.rows.item(i).icono,
        id_usuario: data.rows.item(i).id_usuario,

                });
              }
        }
            this.finanzas.next(finanzas);

      });

    }

cargarFinanzasId(id): Promise<any> {
// return this.database.executeSql('SELECT * FROM finanzas WHERE id = ?', [id])
return this.database.executeSql('SELECT * FROM finanzas WHERE id = ?' [id])
        .then( data => {
      return {
        id: data.rows.item(0).id,
        gasto: data.rows.item(0).gasto,
        tipo_gasto: data.rows.item(0).tipo_gasto,
        descripcion: data.rows.item(0).descripcion,
        fecha: data.rows.item(0).fecha,
        icono: data.rows.item(0).icono,
        id_usuario: data.rows.item(0).id_usuario,
      }
        });

}
agregarGasto(gasto, tipo_gasto, descripcion, fecha, icono , id_usuario){
  let data = [gasto, tipo_gasto, descripcion, fecha, icono,id_usuario];
  return this.database.executeSql('INSERT INTO finanzas (gasto, tipo_gasto, descripcion, fecha,icono ,id_usuario) VALUES (?,?,?,?,?,?)', data)
          .then( _ => {
            this.cargarFinanzas();
            
          });
}

eliminarGasto(id){
       
  return this.database.executeSql('DELETE FROM finanzas WHERE id = ?', [id])
  .then( _ =>{    
    this.cargarFinanzas();
  });
}

// CONFIG 

cargarConfig(){
  let query = 'SELECT * FROM configIni';
  return this.database.executeSql(query, [])
        .then( data =>{
            
          let config = [];
        
        if(data.rows.length > 0){
          for( var i = 0; i < data.rows.length; i++){

            config.push({
              
              id: data.rows.item(i).id,
              inicio: data.rows.item(i).inicio,
              id_usuario: data.rows.item(i).id_usuario,
            });
          }
        }
      this.config.next(config);
        });
}

cargarConfig2(){
  let query = 'SELECT * FROM configDark';
  return this.database.executeSql(query, [])
        .then( data =>{
            
          let config = [];
        
        if(data.rows.length > 0){
          for( var i = 0; i < data.rows.length; i++){

            config.push({
              
              id: data.rows.item(i).id,
              dark: data.rows.item(i).dark,
              id_usuario: data.rows.item(i).id_usuario,
            });
          }
        }
      this.config2.next(config);
        });
}

updateCofigDark(id, dark){

  let data = [dark];
  return this.database.executeSql(`UPDATE configDark SET dark = ? WHERE id = ${id}`, data)
          .then( _ =>{
              this.cargarConfig();
          });
}

updateCofigInicio(id, inicio){

  let data = [inicio];
  return this.database.executeSql(`UPDATE configIni SET inicio = ? WHERE id = ${id}`, data)
          .then( _ =>{
              this.cargarConfig();
          });
}

}



