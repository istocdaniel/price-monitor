import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes'; // Hozzáadjuk a routing modult
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component'; // Login komponens
import { RegisterComponent } from './register/register.component'; // Register komponens

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule // Beállítjuk a routing modult
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
