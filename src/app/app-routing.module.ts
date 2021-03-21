import { NgModule } from '@angular/core';
import { LoginComponent } from './auth/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './navigation/page-not-found/page-not-found.component';
import { AdminComponent } from './dashboard/admin/admin.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signupAdmin', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin/:id', component: AdminComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
