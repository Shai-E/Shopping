import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class RegisterService {
  id:string = "204457097";
  message:string ="Register";
  reqPath: string = `http://localhost:3002/shopping/api`;

  fileHeaders = new HttpHeaders();

  constructor(public _http: HttpClient) {}
  isUserTaken(value: string, content: { id?: string; email?: string }) {
    return this._http.post<string>(
      `${this.reqPath}/auth/check/${value}`,
      content
    );
  }
  executeStepOne(formData: {id: string; email: string; password: string}){
    this.id=formData.id;
    return this._http.post<{id:string}>(
      `${this.reqPath}/auth/register/1`,
      formData
    );
  }

  executeStepTwo(formData: {city: string; street: string; firstName: string; lastName: string; id?:string}){
    formData.id = this.id;
    return this._http.patch<{id:string}>(
      `${this.reqPath}/auth/register/2`,
      formData
    );
  }
  executeStepThree(formData: any){
    this.fileHeaders.set('content-type', 'multipart/form-data')
    this._http.post<any>(
      `${this.reqPath}/auth/upload-image/${this.id}`,
      formData, {
        headers: this.fileHeaders
      }
    ).subscribe();
  }
}
