import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { bottomNavData, navbarData } from './nav-data';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'side-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent {
  navData = navbarData;
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
