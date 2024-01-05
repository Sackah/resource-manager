import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [],
  template: ``,
})
export class RedirectComponent implements OnInit {
  constructor(
    private router: Router,
    private currentUserService: CurrentUserService
  ) {}

  ngOnInit(): void {
    this.currentUserService.get().subscribe({
      next: response => {
        if (response) {
          if (response.user.roles === 'Basic User') {
            this.router.navigateByUrl('/user/dashboard');
          } else if (response.user.roles === 'Manager') {
            this.router.navigateByUrl('/manager/dashboard');
          } else if (response.user.roles === 'Administrator') {
            this.router.navigateByUrl('/admin/dashboard');
          }
        } else {
          this.router.navigateByUrl('/login');
        }
      },
      error: () => {
        this.router.navigateByUrl('/login');
      },
    });
  }
}
