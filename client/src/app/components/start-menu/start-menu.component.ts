import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-start-menu',
  templateUrl: './start-menu.component.html',
  styleUrls: ['./start-menu.component.css']
})
export class StartMenuComponent implements OnInit {

  constructor(public _userService: UserService) { }

  ngOnInit(): void {
  }
  logUserOut() {
    this._userService.logout();
  }
  toggleCheckbox(){
    this._userService.isStartMenuChecked = !this._userService.isStartMenuChecked;
  }
  switchDisplay() {
    const status = this._userService.status;
    switch (status) {
      case 'LOGIN': {
        this._userService.switchDisplay('REGISTER_ONE');
        break;
      }
      case 'REGISTER_ONE': {
        this._userService.switchDisplay(this._userService.initDisplay());
        break;
      }
      case 'REGISTER_TWO': {
        this._userService.switchDisplay(this._userService.initDisplay());
        break;
      }
      case 'REGISTER_THREE': {
        this._userService.switchDisplay(this._userService.initDisplay());
        break;
      }
      default: {
        this._userService.switchDisplay(this._userService.initDisplay());
      }
    }
  }
}
