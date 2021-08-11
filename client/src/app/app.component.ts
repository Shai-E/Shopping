import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from './services/products.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';
  userOptions: boolean = false;
  constructor(public _ps: ProductsService, public _userService: UserService, public _router: Router){
  }
  ngOnInit() {
    this._ps.getProducts().subscribe(p => {
      this._ps.products = p;
      this._ps.checkForActiveCategories();
    })
  }
  logUserOut() {
    this.userOptions = false;
    this._userService.logout();
    this._router.navigateByUrl(`home`);
  }
  displayUserOptions(){
    this.userOptions = !this.userOptions;
  }

  redirectToLogin(){
    this._userService.switchDisplay(this._userService.initDisplay());
    this._userService.isStartMenuChecked = true;
    this.userOptions = false;
    if(this._router.url !== "/home"){
      this._router.navigateByUrl('home');
    }
  }
}
