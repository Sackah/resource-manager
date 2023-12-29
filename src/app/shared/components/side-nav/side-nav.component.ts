import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { bottomNavData, navbarData } from './nav-data';
import {
  RouterModule,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'side-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent implements OnInit {
  navData = navbarData;
  @Input() userRole!: 'user' | 'manager' | 'admin';
  userRoute!: string;

  ngOnInit(): void {
    switch (this.userRole) {
      case 'user':
        this.userRoute = '/user';
        break;
      case 'admin':
        this.userRoute = '/admin';
        break;
      case 'manager':
        this.userRoute = '/manager';
        break;
      default:
        this.userRoute = '/user';
        break;
    }
  }
  bottomData = bottomNavData;
  // get bottomNavData() {
  //   return this.navData.filter(
  //     item =>
  //       item.routeLink === 'message' ||
  //       item.routeLink === 'settings' ||
  //       item.routeLink === 'logout'
  //   );
  // }
}
