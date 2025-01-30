import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CoursesComponent } from './courses/courses.component';
import { ContactComponent } from './contact/contact.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { FreeComponent } from './free/free.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';
import { AuthGuard } from './auth.guard';
import { FaqComponent } from './faq/faq.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
  { path: 'home', component: HomeComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'contact', component: ContactComponent },
 
  { path: 'signup', component: SignupComponent }, // Route for Sign Up
  { path: 'login', component: LoginComponent },
  {path: 'free' , component: FreeComponent},
  {path: 'instructors' , component: InstructorsComponent},
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard] }, // Protect with AuthGuard
  { path: 'trainer-dashboard', component: TrainerDashboardComponent, canActivate: [AuthGuard] },
  { path:'faq', component:FaqComponent},
  {path:'admin-dashboard', component:AdminDashboardComponent, canActivate: [AuthGuard]}
  // { path: '**', redirectTo: '/home' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
