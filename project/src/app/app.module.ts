import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CoursesComponent } from './courses/courses.component';
// import { RegformComponent } from './regform/regform.component';
import { ContactComponent } from './contact/contact.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { PopcoursesComponent } from './popcourses/popcourses.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { FooterComponent } from './footer/footer.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './shared/material/material.module';
import { FreeComponent } from './free/free.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { InstructorsComponent } from './instructors/instructors.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';
import { FaqComponent } from './faq/faq.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CoursesComponent,
    // RegformComponent,
    ContactComponent,
    NavbarComponent,
    HeaderComponent,
    PopcoursesComponent,
    ReviewsComponent,
    FooterComponent,
    SignupComponent,
    LoginComponent,
    FreeComponent,
    InstructorsComponent,
    UserDashboardComponent,
    TrainerDashboardComponent,
    FaqComponent,
    AdminDashboardComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatGridListModule,
      HttpClientModule
  ],
  providers: [
    DataService,
    provideAnimationsAsync()
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
