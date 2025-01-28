import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if there are query parameters for username and password
    this.route.queryParams.subscribe(params => {
      if (params['username'] && params['password']) {
        this.loginForm.patchValue({
          username: params['username'],
          password: params['password']
        });
      }
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.http.post('http://localhost:3000/api/login', { username, password }, { withCredentials: true }).subscribe(response => {
        this.snackBar.open('Successful login', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/dashboard']);
      }, error => {
        this.snackBar.open('Invalid email or password', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      });
    }
  }
}
