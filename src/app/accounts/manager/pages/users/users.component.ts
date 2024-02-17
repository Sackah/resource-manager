import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { UserListComponent } from '../../../admin/components/user-list/user-list.component';
import { ButtonAssignComponent } from '../../../user/components/button-assign/button-assign.component';
import { ButtonNewComponent } from '../../../user/components/button-new/button-new.component';
import { User } from '../../../../shared/types/types';
import { ManagerUsercreationComponent } from '../manager-usercreation/manager-usercreation.component';
import { ArchivedListComponent } from '../../../admin/components/archived-list/archived-list.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    UserListComponent,
    ButtonAssignComponent,
    ButtonNewComponent,
    ManagerUsercreationComponent,
    ArchivedListComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements AfterViewInit {
  managerUserCreationModalOpen = false;

  public display: 'all' | 'active' | 'inactive' | 'archives' | 'pending' =
    'all';

  private closed: boolean = false;

  private opening = true;

  public toggleDisplay(
    view: 'all' | 'active' | 'inactive' | 'archives' | 'pending'
  ): void {
    this.display = view;
  }

  @ViewChild(UserListComponent) UserListComponent?: UserListComponent;

  successMessage: string | null = null;

  ngAfterViewInit(): void {
    if (this.UserListComponent) {
      this.UserListComponent.fetchUsers();
    }
  }

  public updateUsers(): void {
    if (this.UserListComponent) {
      this.UserListComponent.fetchUsers();
      this.successMessage = 'User created successfully!';

      this.managerUserCreationModalOpen = false;

      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
    }
  }

  public openManagerUserCreationModal() {
    this.managerUserCreationModalOpen = true;
  }

  static handleAssignModal(selectedUsers: User[]): void {
    selectedUsers;
  }

  get toggleClasses() {
    return {
      currentview: true,
      opening: this.opening,
      closed: this.closed,
    };
  }
}
