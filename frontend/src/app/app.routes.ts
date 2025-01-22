import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductComponent } from './product/product.component';
import { AuthGuard } from 'auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Alapértelmezett útvonal
  //{ path: '**', redirectTo: '/login' } // Minden más útvonalat login-ra irányít
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Helyes konfiguráció
  exports: [RouterModule]
})
export class AppRoutingModule {}
