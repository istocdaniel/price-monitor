import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      url: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      const apiUrl = 'http://localhost:3000/products/add-product'; // Backend endpoint

      this.http.post(apiUrl, productData).subscribe(
        (response) => {
          console.log('Product added successfully:', response);
        },
        (error) => {
          console.error('Error adding product:', error);
        })
    }
  }
}
