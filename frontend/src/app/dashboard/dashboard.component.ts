import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string = '';
  email: string = ''; // Add email property
  products: any[] = [];
  showAddProductForm: boolean = false;
  newProductName: string = '';
  newProductUrl: string = '';

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadUserProducts();
  }

  loadUserData(): void {
    const token = localStorage.getItem('jwt'); // Retrieve the token from local storage
    this.http.get('http://localhost:3000/api/user', {
      headers: { Authorization: `jwt ${token}` }, // Include the token in the headers
      withCredentials: true
    }).subscribe(
      (response: any) => {
        this.username = response.username;
        this.email = response.email; // Set the email property
      },
      (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  loadUserProducts(): void {
    const token = localStorage.getItem('jwt');
    this.http.get('http://localhost:3000/api/products', {
      headers: { Authorization: `jwt ${token}` },
      withCredentials: true
    }).subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.products = response;
        } else if (response && response.products) {
          this.products = response.products;
        } else {
          this.products = [];
        }

      },
      (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  logout(): void {
    this.http.post('http://localhost:3000/api/logout', {}, { withCredentials: true }).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Logout failed', error);
      }
    );
  }


  toggleAddProductForm(): void {
    this.showAddProductForm = !this.showAddProductForm;
  }

  submitProduct(): void {
    const token = localStorage.getItem('jwt');
    
    // Fetch the user to get the user ID
    this.http.get('http://localhost:3000/api/user', {
      headers: { Authorization: `jwt ${token}` },
      withCredentials: true
    }).subscribe(
      (userResponse: any) => {
        const newProduct = {
          name: this.newProductName,
          url: this.newProductUrl,
          userId: userResponse.id // Ensure the user ID is correctly used
        };

        this.http.post('http://localhost:3000/api/add-product', newProduct, {
          headers: { Authorization: `jwt ${token}` },
          withCredentials: true
        }).subscribe(
          (response: any) => {
            this.loadUserProducts(); // Reload the products from the backend
            this.newProductName = '';
            this.newProductUrl = '';
            this.showAddProductForm = false;
          },
          (error) => {
            this.snackBar.open('Product name or url already added', 'Close', {
                duration: 3000,
                panelClass: ['snackbar-error']
              });
          }
        );
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

  deleteProduct(productId: number): void {
    this.http.post('http://localhost:3000/api/delete-product', { id: productId }, {
      withCredentials: true
    }).subscribe(response => {
      this.loadUserProducts();
    }, error => {
      this.snackBar.open('Failed to delete product', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    });
  }
}
