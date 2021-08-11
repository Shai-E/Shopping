import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  city: string= this._userService.user.city || "";
  street: string = this._userService.user.street || "";
  file!: File;
  fileUrl: SafeUrl = "";
  email: string = this._userService.user.email || "";
  password:string = "";
  conPwd: string = "";
  oldPassword:string = "";
  firstName: string = this._userService.user.firstName || "";
  lastName: string = this._userService.user.lastName || "";
  constructor(public _userService: UserService, public _storeService: StoreService, private sanitization:DomSanitizer, public _router: Router) { }

  ngOnInit(): void {
    if(!this._userService.user.id) this._router.navigateByUrl(`forbidden`);
  }
  onSubmitPicture(f: NgForm) {
    if (!this.file) return;
    const formData = new FormData();
    formData.append('myImage', this.file);
    this._userService.updateProfilePicture(formData);
  }

  selectImage(e: any) {
    if(!e.srcElement.files[0]) return;
    this.file = e.srcElement.files[0];
    this.fileUrl = this.sanitization.bypassSecurityTrustUrl(window.URL.createObjectURL(this.file))
  }

  onSubmitEdit(f: NgForm) {
    this._userService.updateUser(f.value);
  }

  validatePassword(){
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g;
    if(this.password===""){
      this._userService.displayResponseMessage("Password is required")
      return;
    }
    if(!pattern.test(this.password)){
      this._userService.displayResponseMessage("Password must contain a minimum of eight characters, at least one uppercase letter, one lowercase letter and one number")
      return;
    }
    if(this.password !== this.conPwd){
      this._userService.displayResponseMessage("Passwords don't match")
      return;
    }
    if(this.password === this.conPwd){
      this._userService.displayResponseMessage("Passwords match!")
      return;
    }
    return;
  }
}
