import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register-step-three',
  templateUrl: './register-step-three.component.html',
  styleUrls: ['./register-step-three.component.css']
})
export class RegisterStepThreeComponent implements OnInit {

  file?:File;
  fileUrl: SafeUrl = "";

  constructor(public _registerService: RegisterService, public _userService: UserService, private sanitization:DomSanitizer) { }

  ngOnInit(): void {
  }
  onSubmit(f: NgForm) {
    if(!this.file) return;
    const formData = new FormData();
    formData.append('myImage', this.file);
    this._registerService.executeStepThree(formData);
    this._userService.status = "LOGIN";
  }

  selectImage(e:any){
    if(!e.srcElement.files[0]) return;
    this.file = e.srcElement.files[0];
    this.fileUrl = this.sanitization.bypassSecurityTrustUrl(window.URL.createObjectURL(this.file))
  }
}
