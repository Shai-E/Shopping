import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  loading: boolean = false;
  searchKey: string = "";
  isReadyToPlaceOrder: boolean = false;
  isOrderSuccessful: boolean = false;
  date: string = new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  creditCard1: string = "4580";
  creditCard2: string = "";
  creditCard3: string = "";
  creditCard4: string = "";
  city: string = "";
  street: string = "";
  isDateError:string = "";

  
  constructor(public _userService: UserService, public _router:Router, public _storeService: StoreService) { 
  }

  setSearchKey(searchKey:any) {
    this.searchKey = searchKey;
  }


  stringToDate(dateString: string) {
    const year = +dateString.split("-")[0]
    const month = +dateString.split("-")[1]-1
    const day = +dateString.split("-")[2]
    return new Date(year, month, day);
  }

  handleDateChange(e: any){
    const dateString = this.stringToDate(e.target.value);
    const now = this.stringToDate(new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }))
    if (this._storeService.invalidDates.includes(e.target.value) || dateString < now) {
      this.isDateError = dateString < now ? "Date has already passed.": "Too many deliveries on that date."
      e.target.classList = "red"
    } else {
      this.isDateError = "";
      e.target.classList = "green"
    }
  }

  markInvalidDates(e:any) {
  }
  
  validateDeliveryDate(dateString: string) {
    if (!this._storeService.invalidDates.includes(dateString)) {
      return false;
    }
    return true;
  }
  
  ngOnInit(): void {
    this._storeService.getInvalidDates();
  }

  changeReadyState() {
    this.isReadyToPlaceOrder = !this.isReadyToPlaceOrder;
    this.searchKey = "";
  }

  injectValue(value: string) {
    if (value==="city") {
      this.city = this._userService.user.city!;
    }
    if (value==="street") {
      this.street = this._userService.user.street!;
    }
  }

  onSubmit(e:any, f: NgForm) {
    e.preventDefault();
    const data = f.value;
    let card = "";
    for(let i = 1; i<=4; i++){
      card += data["creditCard"+i];
      delete data["creditCard"+i];
    }
    data.card = card;

    this._userService.loadingReciept = true;
    this._userService.placeOrder(data).subscribe(
      (response) => {
        this._userService.displayResponseMessage('Order was Successfully Placed.');
        this._userService.receiptFileName = response.fileName;
        this._userService.user = response.user;
        localStorage.setItem('recieptFileName', response.fileName);
        localStorage.setItem('user', JSON.stringify(response.user));
        this._userService.checkOrderStatus();
        this._userService.loadingReciept = false;
        this.isReadyToPlaceOrder = false;
        this.isOrderSuccessful = true;
      },
      (err) => {
        this._userService.loadingReciept = false;
        if (err.status === 403) {
          this._userService.logout();
          this._router.navigateByUrl(`forbidden`);
        }
        this._userService.handleError(err);
        this.isReadyToPlaceOrder = true;
        this.isOrderSuccessful = false;
      }
    );;
  }

  closeSuccessfulOrderModalAndRouteTo(route: string) {
    this.isOrderSuccessful = false;
    this._router.navigateByUrl(route);
  }

 
  onDigitInput(event:any, idx: number){
    
    let element;
    if (event.code !== 'Backspace'){
      if( event.target.value.length ===4){
        if(idx!==4) {
          element = event.target.nextElementSibling;
          element.value = ""
          event.target.value = event.target.value.substr(0,event.target.value.length )
        }
        if(event.target.nextElementSibling === null) {
          event.target.value = event.target.value.substr(0,event.target.value.length-1 )
        }

      }
    }
    
    if (event.code === 'Backspace'){
      if(event.target.value.length ===0){
        element = event.target.previousElementSibling;
      }  
    }
    if(element == null) return;
    element.focus();
  }


}
