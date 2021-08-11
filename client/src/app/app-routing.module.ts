import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { HomeComponent } from './components/home/home.component';
import { Page404Component } from './components/page404/page404.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ShopComponent } from './components/shop/shop.component';

const routes: Routes = [
  {path:"profile", pathMatch: "full", component: ProfileComponent},
  {path:"home", pathMatch: "full", component: HomeComponent},
  {path:"shop", pathMatch: "full", component: ShopComponent},
  {path:"", pathMatch: "full", redirectTo: "home"},
  {path:"forbidden", component: ForbiddenComponent},
  {path:"**", component: Page404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
