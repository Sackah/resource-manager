import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { User, ProjectDetails, UsersResponse } from '../../../types/types';
import { UsersService } from '../../../../accounts/admin/services/users.service';

@Component({
  selector: 'app-assign-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './assign-modal.component.html',
  styleUrl: './assign-modal.component.css',
})
export class AssignModalComponent implements AfterViewInit {
  @Input() user!: User;

  @Input() users: User[] = [];

  assignForm: FormGroup = new FormGroup({
    workHours: new FormControl('', [Validators.required]),
  });

  @Input() project!: ProjectDetails;

  private opening = false;

  private closed = false;

  public loading = false;

  public bookableUsers: User[] = [];

  public searchQuery = '';

  public hoursDropDownOpen = false;

  public selectedHours = '';

  public query = '';

  public successMessage: string | null = null;

  public errorMessage: string | null = null;

  public response: string | null = null;

  public isSubmitting = false;

  public workHours = 0;

  public workDay: Date = new Date();

  checkedUsers: { [refId: string]: boolean } = {};

  @Output() closeEvent = new EventEmitter<void>();

  @Output() submitEvent = new EventEmitter<void>();

  selectedUsersEvent = new EventEmitter<User[]>();

  selectedUsers: User[] = [];

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  public closeErrorMessage(): void {
    this.errorMessage = null;
  }

  public closeSuccessMessage(): void {
    this.successMessage = null;
  }

  close() {
    this.closed = true;
    this.closeEvent.emit();
  }

  public handleCheck(user: User): void {
    this.checkedUsers[user.refId] = !this.checkedUsers[user.refId];
  }

  public toggleHoursDropdown() {
    this.hoursDropDownOpen = !this.hoursDropDownOpen;
  }

  public hoursDropdown() {
    this.hoursDropDownOpen = false;
  }

  public selectHour(hour: string) {
    const workHoursControl = this.assignForm.get('workHours');
    if (workHoursControl) {
      workHoursControl.setValue(hour);
      this.selectedHours = hour;
      this.hoursDropdown;
    }
  }

  submit(): void {
    if (this.assignForm.valid) {
      const workHours = this.assignForm.get('workHours')?.value;
      this.usersService
        .assignUser(
          this.project.name,
          this.bookableUsers
            .filter(user => user.selected)
            .map(user => user.refId),
          workHours
        )
        .subscribe({
          next: response => {
            this.successMessage = response.message;
            setTimeout(() => {
              this.successMessage = null;
            }, 3000);
          },
          error: error => {
            if (error.status >= 500) {
              this.errorMessage =
                'Server Error" Something went wrong on the server.';
            } else if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'An unexpected error occured.';
            }

            setTimeout(() => {
              this.errorMessage = null;
            }, 3000);
          },
          complete: () => {
            this.close();
            this.isSubmitting = false;
          },
        });
    }
  }

  ngAfterViewInit(): void {
    this.fetchBookableUsers(this.query);
  }

  public onSearchChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.fetchBookableUsers(query);
  }

  private fetchBookableUsers(query: string): void {
    this.loading = true;
    this.usersService.getBookableUsers(query).subscribe({
      next: (response: UsersResponse) => {
        const bookableUsers = response.users || [];
        if (Array.isArray(bookableUsers)) {
          this.bookableUsers = bookableUsers as User[];

          this.bookableUsers.forEach(user => {
            user.selected = this.checkedUsers[user.refId] || false;
          });
        } else {
          this.errorMessage = 'Error retrieving users. Please try again later.';
        }
      },
      error: error => {
        error;
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get modalClasses() {
    return {
      modal: true,
      opening: this.opening,
      closed: this.closed,
    };
  }

  get backdropClasses() {
    return {
      backdrop: true,
      opening: this.opening,
      closed: this.closed,
    };
  }
}
