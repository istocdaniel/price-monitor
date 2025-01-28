import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ReactiveFormsModule } from '@angular/forms'; 
import { JwtModule } from "@auth0/angular-jwt";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component'; // Importáld a Dashboard komponenst
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

export const LOCALSTORAGE_KEY_NESTJS_TODO_APP = 'nestjs_todo_app';

export function tokenGetter() {
  return localStorage.getItem(LOCALSTORAGE_KEY_NESTJS_TODO_APP);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent // Add hozzá a Dashboard komponenst
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    ReactiveFormsModule, 
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000']
      }
    }),
    CommonModule, // Add CommonModule to imports
    FormsModule, // Add FormsModule to imports
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
