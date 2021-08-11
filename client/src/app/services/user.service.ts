import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import CartItemModel from '../models/cart-item.model';
import OrderModel from '../models/order.model';
import Product from '../models/products.model';
import UserModel from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  displayAddForm: boolean = false;
  productToEdit?: Product;
  isStartMenuChecked: boolean = false;
  responseMessage: string = '';
  user: UserModel = JSON.parse(localStorage.getItem('user')!) || {};
  status: string = this.initDisplay();
  cart: CartItemModel[] = [];
  cartId: number = 0;
  lastOrder: OrderModel[] = [];
  total: number = 0;
  receiptFileName: string = localStorage.getItem('recieptFileName') || '';
  loadingReciept: boolean = false;
  headers = new HttpHeaders();
  reqPath: string = `http://localhost:3002/shopping/api`;

  subscription: any;

  calcTotal: Function = (cartItems: CartItemModel[]) => {
    this.total = cartItems.reduce((t, i) => (i.price ? t + i.price : t), 0);
  };
  getCart: Function = (cart: {
    cartItems: CartItemModel[];
    cartId: number;
  }) => {
    this.cartId = cart.cartId;
    this.cart = cart.cartItems;
    this.calcTotal(cart.cartItems);
  };

  constructor(public _http: HttpClient, public _router: Router) {}

  public getToken() {
    return this.user.accessToken;
  }

  initDisplay() {
    return this.user.id ? 'LOGOUT' : 'LOGIN';
  }

  switchDisplay(newStatus: string) {
    this.status = newStatus;
  }

  setUpHeader(contentType: string) {
    if (
      localStorage.getItem('user') &&
      localStorage.getItem('user') !== 'null'
    ) {
      this.user.accessToken = JSON.parse(
        localStorage.getItem('user')!
      ).accessToken;
      this.headers = new HttpHeaders({
        authorization: `Bearer ${this.user.accessToken!}`,
      });
    }
    this.headers.set('Content-Type', contentType); // 'application/json' / 'multipart/form-data'
  }
  refresh() {
    this.setUpHeader('application/json');
    this._http
      .get<{ accessToken: string }>(`${this.reqPath}/auth/token`, {
        headers: this.headers,
        withCredentials: true,
      })
      .subscribe((accessToken) => {
        this.user.accessToken = accessToken.accessToken;
        localStorage.setItem('user', JSON.stringify(this.user));
      });
  }

  logout() {
    this.setUpHeader('application/json');
    this._http
      .delete(`${this.reqPath}/auth/logout/${this.user.id}`, {
        headers: this.headers,
        withCredentials: true,
      })
      .subscribe();
    this.user = {};
    this.lastOrder = [];
    this.cart = [];
    this.total = 0;
    localStorage.removeItem('user');
    localStorage.removeItem('recieptFileName');
    this.switchDisplay('LOGIN');
  }

  login(content: { email: string; password: string }) {
    this.setUpHeader('application/json');
    return this._http
      .post<UserModel>(`${this.reqPath}/auth/login`, content, {
        headers: this.headers,
        withCredentials: true,
      })
      .subscribe(
        (user) => {
          this.user = user;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.checkOrderStatus();
          this.switchDisplay('LOGOUT');
          if (this.user.isAdmin == true) {
            this._router.navigateByUrl(`shop`);
          }
          this.isStartMenuChecked = false;
        },
        (err) => {
          this.handleError(err);
        }
      );
  }

  checkOrderStatus() {
    if (!this.user.id || this.user.isAdmin == true) return;
    this.setUpHeader('application/json');
    this._http
      .get<{ cartItems: CartItemModel[]; cartId: number }>(
        `${this.reqPath}/carts/` + this.user.id,
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      .subscribe(
        (cart) => this.getCart(cart),
        (err) => {
          if (err.status === 403) {
            this.logout();
            this._router.navigateByUrl(`forbidden`);
          }
        }
      );

    this._http
      .get<OrderModel[]>(`${this.reqPath}/orders/last/` + this.user.id, {
        headers: this.headers,
        withCredentials: true,
      })
      .subscribe((order) => {
        this.lastOrder = order;
      });
  }

  addProductToCart(productId: number, amount: number, size: string) {
    this.refresh();
    this.setUpHeader('application/json');
    this._http
      .post<{ cartItems: CartItemModel[]; cartId: number }>(
        `${this.reqPath}/carts/add-item/${this.user.id}`,
        {
          cartId: this.cartId,
          productId,
          amount,
          size,
        },
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      .subscribe(
        (cart) => {
          this.getCart(cart);
          this.displayResponseMessage('Added product to cart');
        },
        (err) => {
          if (err.status === 403) {
            this.logout();
            this._router.navigateByUrl(`forbidden`);
          }
        }
      );
  }

  removeProductFromCart(itemId: number) {
    this.refresh();
    this.setUpHeader('application/json');
    this.subscription = this._http
      .delete<{ cartItems: CartItemModel[]; cartId: number }>(
        `${this.reqPath}/carts/remove-item/${this.user.id}/${itemId}`,
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      .subscribe(
        (cart) => {
          this.checkOrderStatus();
          this.displayResponseMessage('Removed product from cart');
          this.subscription.unsubscribe();
        },
        (err) => {
          if (err.status === 403) {
            this.logout();
            this._router.navigateByUrl(`forbidden`);
          }
        }
      );
  }

  removeAllProductsFromCart() {
    this.refresh();
    this.setUpHeader('application/json');
    this.subscription = this._http
      .delete<{ cartItems: CartItemModel[]; cartId: number }>(
        `${this.reqPath}/carts/remove-all-items/${this.user.id}`,
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      .subscribe(
        (cart) => {
          this.checkOrderStatus();
          this.displayResponseMessage('All products were removed from cart');
          this.subscription.unsubscribe();
        },
        (err) => {
          if (err.status === 403) {
            this.logout();
            this._router.navigateByUrl(`forbidden`);
          }
        }
      );
  }

  increaseAmount(itemId: number) {
    this.refresh();
    this.setUpHeader('application/json');
    this.subscription = this._http
      .patch<{ cartItems: CartItemModel[]; cartId: number }>(
        `${this.reqPath}/carts/update-amount/increase/${this.user.id}/${itemId}`,
        null,
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      .subscribe(
        (cart) => {
          this.checkOrderStatus();
          this.subscription.unsubscribe();
        },
        (err) => {
          if (err.status === 403) {
            this.logout();
            this._router.navigateByUrl(`forbidden`);
          }
        }
      );
  }

  decreaseAmount(itemId: number) {
    this.refresh();
    this.setUpHeader('application/json');
    this.subscription = this._http
      .patch<{ cartItems: CartItemModel[]; cartId: number }>(
        `${this.reqPath}/carts/update-amount/decrease/${this.user.id}/${itemId}`,
        null,
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      .subscribe(
        (cart) => {
          this.checkOrderStatus();
          this.subscription.unsubscribe();
        },
        (err) => {
          if (err.status === 403) {
            this.logout();
            this._router.navigateByUrl(`forbidden`);
          }
        }
      );
  }

  placeOrder(data: {
    card: string;
    date: string;
    city: string;
    street: string;
  }) {
    // this.loadingReciept = true;
    this.refresh();
    this.setUpHeader('application/json');
    return this._http
      .post<{ fileName: string; user: UserModel }>(
        `${this.reqPath}/orders/${this.user.id}`,
        data,
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      // .subscribe(
      //   (response) => {
      //     this.displayResponseMessage('Order was Successfully Placed.');
      //     this.receiptFileName = response.fileName;
      //     this.user = response.user;
      //     localStorage.setItem('recieptFileName', response.fileName);
      //     localStorage.setItem('user', JSON.stringify(response.user));
      //     this.checkOrderStatus();
      //     this.loadingReciept = false;
      //   },
      //   (err) => {
      //     this.loadingReciept = false;
      //     if (err.status === 403) {
      //       this.logout();
      //       this._router.navigateByUrl(`forbidden`);
      //     }
      //     this.handleError(err);
      //   }
      // );
  }

  updateProfilePicture(formData: any) {
    this.refresh();
    this.setUpHeader('multipart/form-data');
    this._http
      .post<{ fileName: string }>(
        `${this.reqPath}/auth/upload-image/${this.user.id}`,
        formData,
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      .subscribe(
        (result) => {
          this.user.picture = result.fileName;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.displayResponseMessage('Successfully Uploaded Picture.');
        },
        (err) => {
          if (err.status === 403) {
            this.logout();
            this._router.navigateByUrl(`forbidden`);
          }
        }
      );
  }

  updateUser(data: {
    city?: string;
    street?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    email?: string;
    oldPassword?: string;
  }) {
    this.refresh();
    this.setUpHeader('application/json');
    this._http
      .patch<UserModel>(
        `${this.reqPath}/auth/update-user/${this.user.id}`,
        data,
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      .subscribe(
        (user) => {
          this.user = user;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.displayResponseMessage('Successfully Updated User.');
        },
        (err) => {
          if (err.status === 403) {
            this.logout();
            this._router.navigateByUrl(`forbidden`);
          }
          this.handleError(err);
        }
      );
  }

  handleError(err: any) {
    this.responseMessage = err.error.message || err.error || 'Unknown Error';
    this.removeResponseMessage();
  }

  displayResponseMessage(message: string) {
    this.responseMessage = message;
    this.removeResponseMessage();
  }

  removeResponseMessage() {
    setTimeout(() => {
      this.responseMessage = '';
    }, 3000);
  }
}
