import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  constructor(public _userService: UserService,public _productsService: ProductsService , public _storeService: StoreService) { }

  ngOnInit(): void {
    // localStorage.removeItem("user");
    this._userService.checkOrderStatus();
    this._storeService.getOrdersCount();
  }

}
