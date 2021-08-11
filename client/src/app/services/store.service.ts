import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  numberOfOrders: number = 0;
  invalidDates:string[] = [];
  reqPath: string = `http://localhost:3002/shopping/api`;

  cities: string[] = [
    "ʿAfula",
    "ʿAkko",
    "ʿArad",
    "Ashdod",
    "Ashqelon",
    "Bat Yam",
    "Beersheba",
    "Bet Sheʾan",
    "Bet Sheʿarim",
    "Bnei Brak",
    "Caesarea",
    "Dimona",
    "Dor",
    "Elat",
    "ʿEn Gedi",
    "Givʿatayim",
    "H̱adera",
    "Haifa",
    "Herzliyya",
    "H̱olon",
    "Jerusalem",
    "Karmiʾel",
    "Kefar Sava",
    "Lod",
    "Meron",
    "Nahariyya",
    "Nazareth",
    "Netanya",
    "Petaẖ Tiqwa",
    "Qiryat Shemona",
    "Ramat Gan",
    "Ramla",
    "Reẖovot",
    "Rishon LeẔiyyon",
    "Sedom",
    "Tel Aviv–Yafo",
    "Tiberias",
    "Ẕefat"
  ]
  constructor(public _http: HttpClient) { }

  getOrdersCount(){
    this._http.get<number>(`${this.reqPath}/orders/count`).subscribe(ordersCount=>this.numberOfOrders = ordersCount);
  }

  getInvalidDates() {
    this._http.get<string[]>(`${this.reqPath}/orders/invalid-dates`).subscribe(invalidDates=>this.invalidDates = invalidDates);
  }
}
