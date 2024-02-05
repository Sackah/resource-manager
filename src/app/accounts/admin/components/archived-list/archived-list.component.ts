import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { GenericResponse, User } from '../../../../shared/types/types';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDeleteModalComponent } from '../../../../shared/components/modals/user-delete-modal/user-delete-modal.component';
@Component({
  selector: 'app-archived-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archived-list.component.html',
  styleUrl: './archived-list.component.css',
})
export class ArchivedListComponent implements OnInit {
  public archivedUsers: User[] = [];
  public loading = false;
  public showDropdownForUser: User | null = null;
  public totalArchivedUsers: number = 0;
  public successMessage: string | null = null;
  public errorMessage: string | null = null;
  public showModalForUser: User | null = null;

  constructor(
    private usersService: UsersService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchArchivedUsers();
  }

  public toggleDropdown(user: User): void {
    this.showDropdownForUser = this.showDropdownForUser === user ? null : user;
  }

  public openDeleteUserModal(archiveduser: User) {
    const modalRef = this.modalService.open(UserDeleteModalComponent);
    modalRef.componentInstance.archivedUsers = archiveduser;

    modalRef.result.then(result => {
      if (result === 'delete') {
        this.deleteUser(archiveduser);
      }
    });
  }

  private fetchArchivedUsers(): void {
    this.loading = true;
    this.usersService.archivedUsers().subscribe({
      next: (response: any) => {
        const archivedUsers = response?.archives || [];
        if (Array.isArray(archivedUsers)) {
          this.archivedUsers = archivedUsers as User[];
          this.totalArchivedUsers = archivedUsers.length;
        } else {
        }
      },
      error: error => {
        error;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  public restoreUser(email: string): void {
    this.loading = true;
    this.usersService.restoreUser(email).subscribe({
      next: response => {
        this.successMessage = response.message;
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
        this.fetchArchivedUsers();
      },

      error: () => {
        this.errorMessage =
          'Server Error: Could not restore user, please try again later.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }

  deleteUser(user: User): void {
    if (!user) {
      return;
    }

    this.usersService.deleteUser(user.email).subscribe({
      next: (response: GenericResponse) => {
        this.successMessage = response.message;
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
        this.fetchArchivedUsers();
      },
      error: () => {
        this.errorMessage =
          'Server Error: Could not delete user, please try again later.';

        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }
}
