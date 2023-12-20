import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MainComponent } from '../main/main.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent,MainComponent,SideNavComponent,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
 
}
