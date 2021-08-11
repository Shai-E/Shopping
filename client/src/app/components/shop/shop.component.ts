import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Product from 'src/app/models/products.model';
import { ProductsService } from 'src/app/services/products.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  cartDisplay: boolean = false;
  // product: Product | null = null;
  constructor(public _userService: UserService, public _router: Router, public _productsService: ProductsService) {
  }

  ngOnInit(): void {
    if(!this._userService.user.id) this._router.navigateByUrl(`forbidden`);
    if(window.innerWidth>=780){
     this.cartDisplay = false; 
    }else{
      this.cartDisplay = true; 
    }
    this._userService.checkOrderStatus();
  }
}
