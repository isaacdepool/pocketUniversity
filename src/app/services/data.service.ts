import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { component } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {

   }

   getData(){
     return this.http.get<component[]>('/assets/data/menu.json');
   }

   getYoutube(){
     return this.http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q=metodos%20de%20estudio%20universitario&type=video&key=AIzaSyA6DilEzJe0GK-Y_5la5uYQjiDt41-zM74&');
   }

   
}
