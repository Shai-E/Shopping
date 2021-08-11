import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register-step-two',
  templateUrl: './register-step-two.component.html',
  styleUrls: ['./register-step-two.component.css']
})
export class RegisterStepTwoComponent implements OnInit {
  firstName: string = "";
  lastName: string = "";
  city: string = "";
  street: string = "";


  constructor(public _registerService: RegisterService, public _router:Router, public _userService: UserService, public _storeService : StoreService) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    this._registerService.executeStepTwo(f.value).subscribe(result => {
      this._registerService.message="Step two is done.";
    });
    this._userService.status = "REGISTER_THREE";
  }
}
