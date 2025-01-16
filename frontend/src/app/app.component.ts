import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; // Ha szükséges, hogy a CommonModule-t importáld

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule] // Bármilyen modul vagy komponens, amire szükséged van
})
export class AppComponent {
  title = 'my-app';
}
