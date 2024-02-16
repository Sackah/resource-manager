import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, OnDestroy } from '@angular/core';
import {
  RouterModule,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { BASE_URL } from 'src/environment/config';
import { AccesstokenService } from '@app/shared/services/accesstoken.service';
import { bottomNavData, navbarData } from './nav-data';

@Component({
  selector: 'app-side-nav',
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
export class SideNavComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];

  public navData = navbarData;

  @Input() userRole!: 'user' | 'manager' | 'admin';

  userRoute!: string;

  http = inject(HttpClient);

  tokenService = inject(AccesstokenService);

  router = inject(Router);

  loggingOut = false;

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

  public handleLogout(event: Event) {
    event.preventDefault();
    this.loggingOut = true;

    const httpSub = this.http.post(`${BASE_URL}/users/logout`, {}).subscribe({
      next: () => {
        this.tokenService.clear();
        this.router.navigateByUrl('/login');
        this.loggingOut = false;
      },
      error: err => {
        err;
        this.loggingOut = false;
      },
    });

    this.subscriptions.push(httpSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      if (sub) sub.unsubscribe();
    });
  }
}
