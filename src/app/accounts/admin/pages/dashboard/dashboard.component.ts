import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MainComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
