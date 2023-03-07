import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

 
  showpassword = false;
  passwordtogglericon = 'eye';
  


  constructor() { }

  ngOnInit() {
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
