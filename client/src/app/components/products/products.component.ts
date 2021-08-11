import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy, AfterContentInit {
  prodIdx: number = 0;
  isChecked: boolean = false;
  isLoading: boolean = true;
  mobileProductsNavChecked:boolean = true;
  constructor(
    public _productsService: ProductsService,
    public _userService: UserService
  ) {}

  ngOnInit(): void {
    if(window.innerWidth>=780){
      this.mobileProductsNavChecked = false; 
     }else{
       this.mobileProductsNavChecked = true; 
     }
  }

  ngAfterContentInit() {
    this.isLoading = false;
  }

  ngOnDestroy() {
    this._productsService.currCategory = '';
  }

  displayCategory(category: string) {
    this._productsService.currCategory = category;
    this._productsService.setProductsToDisplay(category);
    this.prodIdx = 0;
  }

  filterProducts(e: any) {
    this._productsService.filterProducts({searchKey: e.target.value});
  }

  handleSearchToggle(){
    this.displayCategory('');
    if(this.isChecked) this._productsService.getProducts().subscribe(p => this._productsService.products = p);
  }

  displayAddForm() {
    this._userService.displayAddForm = !this._userService.displayAddForm;
    if(this._userService.displayAddForm){
      this._productsService.doneEditingProducts()
    }
  }
}
