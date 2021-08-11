import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  password: string = ""
  email: string = ""
  constructor(public _userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    this._userService.login(f.value);
  }

}
