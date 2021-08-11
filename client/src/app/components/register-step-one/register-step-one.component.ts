import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register-step-one',
  templateUrl: './register-step-one.component.html',
  styleUrls: ['./register-step-one.component.css'],
})
export class RegisterStepOneComponent implements OnInit {
  id: string = '';
  password: string = '';
  conPwd: string = '';
  email: string = '';
  errors = {
    email: '',
    id: '',
    password: ''
  };
  constructor(public _registerService: RegisterService, public _router:Router, public _userService:UserService) {}

  ngOnInit(): void {}

  validatePassword(pattern: RegExp){
    if(this.password===""){
      this.errors.password = "Password is required";
      return;
    }
    if(!pattern.test(this.password)){
      this.errors.password = "Password must contain a minimum of eight characters, at least one uppercase letter, one lowercase letter and one number";
      return;
    }
    if(this.password !== this.conPwd){
      this.errors.password = "Passwords don't match";
      return;
    }
    this.errors.password = "";
    return;
  }

  validateId(pattern: RegExp) {
    if (this.id === '') {
      this.errors.id = 'ID is required';
      return false;
    };
    pattern = /^[0-9]{9}$/g;
    if (!pattern.test(this.id)) {
      this.errors.id = 'ID has to include 9 numbers';
      return false;
    } else {
      this.errors.id = '';
    }
    return true;
  }

  validateEmail(pattern: RegExp){
    if (this.email === '') {
      this.errors.email = 'Email is required';
      return false;
    };
    if (!pattern.test(this.email.toLowerCase())) {
      this.errors.email = 'Invalid email';
      return false;
    } else {
      this.errors.email = '';
    }
    return true;
  }

  validateForm(value: string) {
    let content = {};

    if(value==="password") {
      this.validatePassword(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g);
      return;
    }

    if (value === 'id') {
      if(!this.validateId(/^[0-9]{9}$/g)) return;
      content = { id: this.id };
    }

    if (value === 'email') {
      if(!this.validateEmail(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) return;
      content = { email: this.email };
    }

    this._registerService
      .isUserTaken(value, content)
      ?.subscribe((ok: string) => {
        if (ok === 'ID_TAKEN') this.errors.id = 'The ID number you chose is already in use';
        if (ok === 'ID_OK') this.errors.id = '';
        if (ok === 'EMAIL_TAKEN') this.errors.email = 'The email you chose is already in use';
        if (ok === 'EMAIL_OK') this.errors.email = '';
      });
  }

  onSubmit(f: NgForm) {
    const data = f.value;
    delete data.confirmPwd;
    this._registerService.executeStepOne(data).subscribe(result => this.id===result.id?this._registerService.message="Step one is done. Move on to step 2.":this._registerService.message="Registration failed.");
    this._userService.status = "REGISTER_TWO";
  }
}
