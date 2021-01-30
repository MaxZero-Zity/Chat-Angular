import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;
  emailRegister: string;
  passwordRegister: string;

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.userForm = new FormGroup({
      emailRegister: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      passwordRegister: new FormControl('', [
        Validators.pattern('^(?=.*[0–9])(?=.*[a-zA-Z])([a-zA-Z0–9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ])
    });
  }
  register(): void {
    this.auth.register(this.userForm.value.emailRegister, this.userForm.value.passwordRegister)
  }

}
