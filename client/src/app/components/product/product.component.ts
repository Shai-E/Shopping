import { Component, Input, OnInit } from '@angular/core';
import Product from 'src/app/models/products.model';
import { ProductsService } from 'src/app/services/products.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  @Input()
  product!: Product;
  size: string = '';
  picIdx: number = 0;
  setAmount:boolean = false;
  amount:number = 1;

  constructor(public _userService: UserService, public _productsService: ProductsService) {}

  ngOnInit(): void {}

  toggleSetAmount(){
    this.setAmount = !this.setAmount;
  }

  setLess(){
    this.amount = this.amount-1;
    if(this.amount<1){
      this.setAmount = !this.setAmount;
      this.amount = 1;
    }
  }

  setMore(){
    this.amount = this.amount+1;
  }

  addProductToCart(productId: number) {
    this.setAmount = !this.setAmount;
    this._userService.addProductToCart(productId, this.amount, this.size);
    this._userService.checkOrderStatus();
    this.amount = 1;
  }

  setSize(event: any) {
    this.size = event.target.value;
  }

  changeItem(i:number) {
    this.picIdx = i;
  }
}
