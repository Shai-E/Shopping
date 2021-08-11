import { Component, OnInit, Input } from '@angular/core';
import CartItemModel from 'src/app/models/cart-item.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {
  @Input() cartItem!: CartItemModel;
  @Input() searchKey!: string;
  @Input() isReadyToPlaceOrder!: boolean;
  constructor(public _userService: UserService) { }

  ngOnInit(): void {
  }

  removeItem(itemId: number) {
    this._userService.removeProductFromCart(itemId);
  }

  increaseAmount(itemId: number) {
    this._userService.increaseAmount(itemId);
  }

  decreaseAmount(itemId: number) {
    this._userService.decreaseAmount(itemId);
  }
}
