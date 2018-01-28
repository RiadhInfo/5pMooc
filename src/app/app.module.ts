import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { BlogService } from './services/blog.service';
import { CourService } from './services/cour.service';

import { LoginComponent } from './components/login/login.component';
// import { FlashMessagesModule } from 'angular2-flash-messages';
import {FlashMessageModule} from 'angular-flash-message';

import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { CourComponent } from './components/cour/cour.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CourDetailComponent } from './components/cour-detail/cour-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    CourComponent,
    CourDetailComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    // FlashMessagesModule,
    FlashMessageModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, BlogService, CourService],
  bootstrap: [AppComponent]
})
export class AppModule { }
