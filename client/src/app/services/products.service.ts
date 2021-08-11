import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Product from '../models/products.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  headers = new HttpHeaders();
  products: Product[] = [];
  productsToEdit:Product[] = [];
  productIdsToEdit:number[] = [];
  productsToDisplay: Product[] = [];
  categories: { category: string; id: number }[] = [];
  activeCategories: { category: string; id: number }[] = [];
  currCategory: string = '';
  accessToken: string = ''
  reqPath: string = `http://localhost:3002/shopping/api`;

  isCheckedArrForEdit: { [index: number]: boolean } = {};

  subscription: any;
  constructor(public _http: HttpClient, public _router: Router, public _userService: UserService) {
    this.getCategories();
  }

  setUpHeader(contentType: string) {
    if(localStorage.getItem('user') && localStorage.getItem('user')!='null'){
      this.accessToken = JSON.parse(
        localStorage.getItem('user')!
      ).accessToken;
      this.headers = new HttpHeaders({
        authorization: `Bearer ${this.accessToken!}`,
      });
    }
    this.headers.set('Content-Type', contentType); // 'application/json' / 'multipart/form-data'
  }

  refresh(){
    this.setUpHeader('application/json');
    this._http.get<{accessToken: string}>(`${this.reqPath}/auth/token`, {
      headers: this.headers,
      withCredentials: true
    }).subscribe(accessToken=>{
      const user = JSON.parse(localStorage.getItem("user")!)
      if(user) user.accessToken=accessToken.accessToken;
      localStorage.setItem('user', JSON.stringify(user));
    });
  }

  getProducts() {
    this.setUpHeader('application/json');
    return this._http.get<Product[]>(`${this.reqPath}/products`);
  }

  getCategories() {
    this.subscription = this._http
      .get<{ category: string; id: number }[]>(
        `${this.reqPath}/products/categories`
      )
      .subscribe((c) => {
        this.categories = c;
        this.checkForActiveCategories();
        this.subscription.unsubscribe();
      });
  }

  createCategory(data: { category: string }) {
    this.refresh();
    this.setUpHeader('application/json');
    this.subscription = this._http
      .post<{ category: string; id: number }[]>(
        `${this.reqPath}/products/categories`,
        data,
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      .subscribe((c) => {
        this.categories = c;
        this._userService.displayResponseMessage('Category Created');
        this.subscription.unsubscribe();
      }, err => {
        if(err.status===403) {
          this._userService.logout();
          this._router.navigateByUrl(`forbidden`)
        }
      });
  }

  addProduct(data: { name: string; price: number; categoryId: number }) {
    this.refresh();
    this.setUpHeader('application/json');
    this.subscription = this._http
      .post<Product[]>(`${this.reqPath}/products/add`, data, {
        headers: this.headers,
        withCredentials: true,
      })
      .subscribe((p) => {
        this.products = p;
        this.checkForActiveCategories();
        this.setProductsToDisplay(this.currCategory);
        this._userService.displayResponseMessage('Product Added');
        this.subscription.unsubscribe();
      }, err => {
        if(err.status===403) {
          this._userService.logout();
          this._router.navigateByUrl(`forbidden`)
        }
      });
  }

  uploadPicture(formData: any, productId: number) {
    this.refresh();
    this.setUpHeader('multipart/form-data');
    this.subscription = this._http
      .post<Product[]>(
        `${this.reqPath}/products/upload-image/${productId}`,
        formData,
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      .subscribe((p) => {
        this.products = p;
        this.setProductsToDisplay(this.currCategory);
        this._userService.displayResponseMessage('Image Uploaded')
        this.subscription.unsubscribe();
      }, err => {
        if(err.status===403) {
          this._userService.logout();
          this._router.navigateByUrl(`forbidden`)
        }
      });
  }

  removePicture(fileName: string) {
    this.refresh();
    this.setUpHeader('application/json');
    this.subscription = this._http
      .delete<Product[]>(
        `${this.reqPath}/products/remove-image/${fileName}`,
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      .subscribe((p) => {
        this.products = p;
        this.setProductsToDisplay(this.currCategory);
        this._userService.displayResponseMessage('Image Deleted');
        this.subscription.unsubscribe();
      }, err => {
        if(err.status===403) {
          this._userService.logout();
          this._router.navigateByUrl(`forbidden`)
        }
      });
  }

  editProduct(
    data: { name: string; price: number; categoryId: number },
    productId: number
  ) {
    this.refresh();
    this.setUpHeader('application/json');
    this.subscription = this._http
      .put<Product[]>(
        `${this.reqPath}/products/update/${productId}`,
        data,
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      .subscribe((p) => {
        this.products = p;
        this.checkForActiveCategories();
        this.setProductsToDisplay(this.currCategory);
        this._userService.displayResponseMessage('Product Edited')
        this.subscription.unsubscribe();
      }, err => {
        if(err.status===403) {
          this._userService.logout();
          this._router.navigateByUrl(`forbidden`)
        }
      });
  }

  removeProduct(productId: number) {
    this.refresh();
    this.setUpHeader('application/json');
    this.subscription = this._http
      .delete<Product[]>(
        `${this.reqPath}/products/remove-product/${productId}`,
        {
          headers: this.headers,
          withCredentials: true,
        }
      )
      .subscribe((p) => {
        this.products = p;
        this.checkForActiveCategories();
        this.setProductsToDisplay(this.currCategory);
        this._userService.displayResponseMessage('Product Deleted');
        this.subscription.unsubscribe();
      }, err => {
        if(err.status===403) {
          this._userService.logout();
          this._router.navigateByUrl(`forbidden`)
        }
      });
  }

  filterProducts(data: { searchKey: string }) {
    this.setUpHeader('application/json');
    this.subscription = this._http
      .post<Product[]>(`${this.reqPath}/products/search`, data, {
        headers: this.headers,
        withCredentials: true,
      })
      .subscribe((p) => {
        this.products = p;
        this.subscription.unsubscribe();
      }, err => {
        if(err.status===403) {
          this._userService.logout();
          this._router.navigateByUrl(`forbidden`)
        }
      });
  }

  checkForActiveCategories() {
    const categoryNames = this.products.reduce(
      (activeCategoriesArr: string[], product) =>
        !activeCategoriesArr.includes(`${product.category}`)
          ? [...activeCategoriesArr, `${product.category}`]
          : activeCategoriesArr,
      []
    );
    if (!categoryNames.includes(this.currCategory)) this.currCategory = '';
    this.activeCategories = this.categories.filter((c) =>
      categoryNames.includes(c.category)
    );
  }

  setProductsToDisplay(category: string) {
    this.productsToDisplay = this.products.filter(
      (p) => p.category === category
    );
  }

  editProductDisplay(providedId:number) {
    if(this.productIdsToEdit?.includes(providedId)){
      this.productIdsToEdit = this.productIdsToEdit.filter((id) => id !== providedId);
    } else {
      this.productIdsToEdit?.push(providedId);
      this.doneEditingCategories();
    }
    this.productsToEdit = this.products.filter((product:Product) => this.productIdsToEdit.includes(product.id!));
  }

  doneEditingProducts() {
    this.productIdsToEdit = [];
    this.productsToEdit = [];
  }
  doneEditingCategories() {
    this._userService.displayAddForm = false;
  }
}
