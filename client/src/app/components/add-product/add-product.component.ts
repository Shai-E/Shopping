import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  name: string = "";
  price: number|undefined = undefined;
  categoryId: number = 0;
  category: string = "";
  constructor(public _productsService: ProductsService, public _userService: UserService, public _router: Router) { }

  ngOnInit(): void {
    if(this._userService.user.isAdmin==false) this._router.navigateByUrl(`home`); 
  }
  onSubmitNewProduct(f: NgForm) {
    f.value.categoryId = +f.value.categoryId;
    this._productsService.addProduct(f.value);
  }
  onSubmitNewCategory(f: NgForm) {
    const existingCategories = this._productsService.categories.reduce((categoryNamesArr:string[], category)=> [...categoryNamesArr, category.category],[])
    if(existingCategories.includes(f.value.category)){
      this._userService.displayResponseMessage("Categoty already exists");
      return;
    }
    this._productsService.createCategory(f.value);
  }
}
