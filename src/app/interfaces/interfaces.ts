import { NumericValueAccessor } from '@ionic/angular';

export interface component{
    icon: string;
    name: string;
    redirecTo: string;
}

export interface Dev {
    id: number,
    nombre: string,
    apellido: string,
    avatar: string
  };
  
  export interface event {
    id: number,
    nombre: string,
    inicio: string,
    fin: string,
    dia: string,
    tipo: string,
    comentario: string,
    id_usuario: number,
  };

  export interface materia{ 
    id: number,
    nombre: string,
    id_usuario: number,
    id_periodo: number,
    id_evento: number,
  }
  
  export interface periodo {
    id: number;
    nombre: string;
    id_usuario: number;
  };

  export interface carpeta {
    id: number;
    nombre: string;
    id_usuario: number;
    id_materia: number;
  };

  export interface cuaderno{
    id: number,
    titulo: string,
    fecha_crea: string,
    fecha_mod: string,
    contenido: string,
    id_usuario: number,
    id_materia: number
  }

  export interface archivo{
    id: number,
    url: string,
    id_usuario: Number,
    id_cuaderno: number
  }

  export interface fotos{
    id: number;
    nombre: string,
    url: string,
    fecha: string,
    favorito: number,
    id_carpeta: number,
    id_usuario: number
  }