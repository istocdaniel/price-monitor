import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required] 
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { username, email, password, confirmPassword } = this.registerForm.value;
      if (password !== confirmPassword) {
        this.snackBar.open('Passwords do not match', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: 'snackbar-error'
        });
        return;
      }
      this.http.post('http://localhost:3000/api/register', { username, email, password }).subscribe(response => {
        this.snackBar.open('Successful registration', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
        // Automatically fill in the login form with the registered username and password
        this.router.navigate(['/login'], { queryParams: { username, password } });
      }, error => {
        this.snackBar.open('Username or email already in use', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      });
    }
  }
}
