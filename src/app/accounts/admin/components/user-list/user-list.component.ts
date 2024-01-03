import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../../shared/types/types';
import { Subscription } from 'rxjs';
import { CreateUserService } from '../../services/create-user.service';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'user-list',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  newUser: User = {
    profilePicture: '',
    firstName: '',
    lastName: '',
    email: '',
    department: 'Service Center',
    roles: 'Basic User',
    specializations: [],
  };
  loading: boolean = false;
  private refreshInterval: number = 5000;
  private dataSubscription: Subscription | undefined;

  constructor(
    private usersService: UsersService,
    private userCreationService: CreateUserService
  ) {}

  currentPage = 1;
  itemsPerPage = 5;

  ngOnInit(): void {
    this.fetchUsers();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  fetchUsers(): void {
    this.loading = true;

    this.usersService.getUsers().subscribe(
      (response: any) => {
        const users = response.users || response.data;
        console.log(response.users);
        if (Array.isArray(users)) {
          this.users = users as User[];
        } else {
          console.error('Invalid response format for users:', users);
        }
      },
      error => {
        console.error('Error fetching users:', error);
      },
      () => {
        this.loading = false;
      }
    );
  }

  createUser(): void {
    this.userCreationService.createUser(this.newUser).subscribe(
      createdUser => {
        this.users.push(createdUser);
        this.newUser = {
          firstName: '',
          lastName: '',
          profilePicture: '',
          specializations: [],
          email: '',
          roles: 'Basic User',
          department: 'Service Center',
        };
      },
      error => {
        console.error('Error creating user:', error);
      }
    );
  }
}
