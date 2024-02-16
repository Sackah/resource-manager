import { CommonModule } from '@angular/common';
import {
  Component,
  ViewContainerRef,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { User } from '../../../../shared/types/types';
import { SideNavComponent } from '../../../../shared/components/side-nav/side-nav.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { ButtonAssignComponent } from '../../../user/components/button-assign/button-assign.component';
import { ButtonNewComponent } from '../../../user/components/button-new/button-new.component';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { UsercreationComponent } from '../usercreation/usercreation.component';
import { ManagerUsercreationComponent } from '../../../manager/pages/manager-usercreation/manager-usercreation.component';
import { ArchivedListComponent } from '../../components/archived-list/archived-list.component';
import { InactiveUsersComponent } from '../../components/inactive-users/inactive-users.component';
import { ActiveUsersComponent } from '../../components/active-users/active-users.component';
import { PendingUsersComponent } from '../../components/pending-users/pending-users.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    SideNavComponent,
    HeaderComponent,
    ButtonAssignComponent,
    ButtonNewComponent,
    UserListComponent,
    UsercreationComponent,
    ManagerUsercreationComponent,
    ArchivedListComponent,
    InactiveUsersComponent,
    ActiveUsersComponent,
    PendingUsersComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements AfterViewInit {
  public userCreationModalOpen = false;

  @Output() selectedUsersEvent = new EventEmitter<User[]>();

  constructor(private viewContainerRef: ViewContainerRef) {}

  public display: 'all' | 'active' | 'inactive' | 'archives' | 'pending' =
    'all';

  private closed = false;

  private opening = true;

  toggleDisplay(
    view: 'all' | 'active' | 'inactive' | 'archives' | 'pending'
  ): void {
    this.display = view;
  }

  public openUserCreationModal() {
    this.userCreationModalOpen = true;
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

      this.userCreationModalOpen = false;

      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
    }
  }

  get toggleClasses() {
    return {
      currentview: true,
      opening: this.opening,
      closed: this.closed,
    };
  }
}
