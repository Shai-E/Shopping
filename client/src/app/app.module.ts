import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterStepOneComponent } from './components/register-step-one/register-step-one.component';
import { RegisterStepTwoComponent } from './components/register-step-two/register-step-two.component';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { Page404Component } from './components/page404/page404.component';
import { StartMenuComponent } from './components/start-menu/start-menu.component';
import { AboutComponent } from './components/about/about.component';
import { StatusComponent } from './components/status/status.component';
import { StatusMessageComponent } from './components/status-message/status-message.component';
import { RegisterStepThreeComponent } from './components/register-step-three/register-step-three.component';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductsComponent } from './components/products/products.component';
import { StatusLinkComponent } from './components/status-link/status-link.component';
import { ProductComponent } from './components/product/product.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HighlightSearchPipe } from './pipes/highlight.pipe';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CartHeaderComponent } from './components/cart-header/cart-header.component';

@NgModule({
  declarations: [
    HighlightSearchPipe,
    AppComponent,
    RegisterStepOneComponent,
    RegisterStepTwoComponent,
    HomeComponent,
    ShopComponent,
    Page404Component,
    StartMenuComponent,
    AboutComponent,
    StatusComponent,
    StatusMessageComponent,
    RegisterStepThreeComponent,
    LoginComponent,
    CartComponent,
    ProductsComponent,
    StatusLinkComponent,
    ProductComponent,
    AddProductComponent,
    EditProductComponent,
    ProfileComponent,
    ForbiddenComponent,
    CartItemComponent,
    CartHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
