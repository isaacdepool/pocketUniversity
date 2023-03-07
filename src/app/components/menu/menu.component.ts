import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { component } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  components: Observable<component[]>;
  
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.components = this.dataService.getData();
  }

}
