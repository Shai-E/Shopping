import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cart-header',
  templateUrl: './cart-header.component.html',
  styleUrls: ['./cart-header.component.css']
})
export class CartHeaderComponent implements OnInit {

  @Input() isReadyToPlaceOrder!: boolean;
  @Input() city!: string;
  @Input() street!: string;
  @Output() searchInputEvent = new EventEmitter<string>();
  searchKey: string = "";
  constructor(public _userService: UserService) { }

  ngOnInit(): void {
  }

  setSearchKey() {
    this.searchInputEvent.emit(this.searchKey)
  }

}
