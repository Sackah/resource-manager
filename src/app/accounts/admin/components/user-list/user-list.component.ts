import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../../shared/types/types';
import { Subscription } from 'rxjs';
import { CreateUserService } from '../../services/create-user.service';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { modal } from './modal';
import { CdkMenuModule } from '@angular/cdk/menu';
import { EditModalComponent } from '../edit-modal/edit-modal.component';

@Component({
  selector: 'user-list',
  standalone: true,
  imports: [CommonModule, CdkMenuModule, EditModalComponent],
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

  dropdownModal = modal;
  loading: boolean = false;
  selectedUser: User | null = null;
  showEditModal = false;

  private dataSubscription: Subscription | undefined;

  constructor(
    private usersService: UsersService,
    private userCreationService: CreateUserService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  openEditModal(user: User): void {
    this.selectedUser = user;
    // You may want to open your edit modal here or perform other actions.
    // For now, let's just log the selected user.
    console.log('Selected User:', this.selectedUser);
  }

  handleDropdownOption(option: {
    edit?: string;
    view?: string;
    delete?: string;
  }): void {
    if (option.edit && this.selectedUser) {
      // Set a flag to indicate that the edit modal should be displayed
      this.showEditModal = true;
      // Additional logic if needed, e.g., pass the selected user to the edit modal
      // this.selectedUserForEdit = this.selectedUser;
    } else if (option.view) {
      // Handle the view option here.
    } else if (option.delete && this.selectedUser) {
      // Handle the delete option here.
    }

    // Clear the selected user after handling the option.
    this.selectedUser = null;
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  fetchUsers(): void {
    // this.loading = true;

    // this.usersService.getUsers().subscribe(
    //   (response: any) => {
    //     const users = response.users || response.data;
    //     console.log(response.users);
    //     if (Array.isArray(users)) {
    //       this.users = users as User[];
    //     } else {
    //       console.error('Invalid response format for users:', users);
    //     }
    //   },
    //   error => {
    //     console.error('Error fetching users:', error);
    //   },
    //   () => {
    //     this.loading = false;
    //   }
    // );

    this.users = [
      {
        profilePicture: '',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roles: 'Basic User',
        department: 'Service Center',
        specializations: [],
      },
      {
        profilePicture: '',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roles: 'Basic User',
        department: 'Service Center',
        specializations: [],
      },
      {
        profilePicture: '',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roles: 'Basic User',
        department: 'Service Center',
        specializations: [],
      },
      {
        profilePicture: '',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roles: 'Basic User',
        department: 'Service Center',
        specializations: [],
      },
      {
        profilePicture: '',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roles: 'Basic User',
        department: 'Service Center',
        specializations: [],
      },
      {
        profilePicture: '',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roles: 'Basic User',
        department: 'Service Center',
        specializations: [],
      },
      {
        profilePicture: '',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roles: 'Basic User',
        department: 'Service Center',
        specializations: [],
      },
      {
        profilePicture: '',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roles: 'Basic User',
        department: 'Service Center',
        specializations: [],
      },
    ];
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
