import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css']
})
export class ForbiddenComponent implements OnInit {

  constructor(public _router: Router, public _userService: UserService) { }

  ngOnInit(): void {
  }

  redirectToLogin(){
    this._userService.isStartMenuChecked = true;
    this._router.navigateByUrl('home');
  }
}
