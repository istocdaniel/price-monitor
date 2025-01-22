import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { Router } from '@angular/router';
import { LoginResponse } from './login-response.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})

export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private snackBar: MatSnackBar,
    private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  showMessage(message: string, type: 'success' | 'error') {
    const panelClass = type == 'success' ? 'success-snackbar' : 'error-snackbar'
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [panelClass]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post<LoginResponse>('http://localhost:3000/login', this.loginForm.value).subscribe(
        (response) => {
          //localStorage.setItem('token', response.token)
          console.log(localStorage.getItem('token')); // Ellenőrizd, hogy elmentődött-e
          this.showMessage('Successful login', 'success');
          console.log('Navigating to /products');
          this.router.navigate(['/products'])
          //location.reload()
        },
        (error) => {
          this.showMessage('Invalid email or password', 'error');
        }
      );
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
