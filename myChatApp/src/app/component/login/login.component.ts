import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  [x: string]: any;

  constructor(public authService: AuthService, public router: Router,) { }

  ngOnInit(): void {
  }


 getLogin(email:string,password:string){
    // this.router.navigate(['dashboard']);
    this.authService.logIn(email, password)
 }

}
