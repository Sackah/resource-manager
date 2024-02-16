import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { SideNavComponent } from '@app/shared/components/side-nav/side-nav.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, RouterLink, SideNavComponent, HeaderComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {}
