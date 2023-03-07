import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  showpassword = false;
  passwordtogglericon = 'eye';


  constructor(private router: Router) { }

  ngOnInit() {
  }

login(){
  this.router.navigate(['/inicio']);
}


togglepassword(){
  this.showpassword = !this.showpassword;

  if(this.passwordtogglericon === 'eye'){
this.passwordtogglericon = 'eye-off';
}else{

this.passwordtogglericon = 'eye';
}

}


}
