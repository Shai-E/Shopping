import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Product from 'src/app/models/products.model';
import { ProductsService } from 'src/app/services/products.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  @Input() product!: Product;

  file!: File;
  fileUrl: SafeUrl = "";
  name!: string;
  price!: number;
  categoryId!: number;

  constructor(public _productsService: ProductsService, public _userService: UserService, private sanitization:DomSanitizer) {
  }
  ngOnInit(): void {
    this.name = this.product.name;
    this.price = this.product.price;
    this.categoryId = this._productsService.categories.find((c) => c.category === this.product.category)!.id;
    this._productsService.checkForActiveCategories();
  }

  onSubmit(f: NgForm) {
    if (!this.file) return;
    const formData = new FormData();
    formData.append('myImage', this.file);
    this._productsService.uploadPicture(formData, this.product.id!);
  }

  selectImage(e: any) {
    if(!e.srcElement.files[0]) return;
    this.file = e.srcElement.files[0];
    this.fileUrl = this.sanitization.bypassSecurityTrustUrl(window.URL.createObjectURL(this.file))
  }
  onSubmitEditProduct(f: NgForm) {
    f.value.categoryId = +f.value.categoryId;
    this._productsService.editProduct(f.value, this.product.id!);
  }

  removeImage(fileName:string) {
    this._productsService.removePicture(fileName);
  }

  removeProduct() {
    this._productsService.removeProduct(this.product.id!);
    this._productsService.productIdsToEdit = this._productsService.productIdsToEdit.filter(id=>id!==this.product.id!)

  }

  setIsChecked(e: any) {
    this._productsService.isCheckedArrForEdit[this.product.id!]=e.target.checked;
  }

}
