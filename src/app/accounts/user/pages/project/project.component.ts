import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { SideNavComponent } from '@app/shared/components/side-nav/side-nav.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, RouterLink, SideNavComponent, HeaderComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent {}
