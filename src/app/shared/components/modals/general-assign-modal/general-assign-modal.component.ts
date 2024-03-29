import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  AfterViewInit,
} from '@angular/core';

import { User, ProjectDetails } from '../../../types/types';
import { UsersService } from '../../../../accounts/admin/services/users.service';
import { ChangeDetectorRef } from '@angular/core';
import { ProjectsService } from '../../../../accounts/admin/services/projects.service';
import {
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-general-assign-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './general-assign-modal.component.html',
  styleUrl: './general-assign-modal.component.css',
})
export class GeneralAssignModalComponent implements AfterViewInit, OnInit {
  @Input() user!: User;
  @Input() users: User[] = [];
  @Input() project!: ProjectDetails;
  opening: boolean = false;
  closed: boolean = false;
  loading: boolean = false;
  bookableUsers: User[] = [];
  searchQuery: string = '';
  query: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  response: string | null = null;
  selectedProject: string = '';
  projects: ProjectDetails[] = [];
  projectForm!: FormGroup;

  @Output() closeEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<void>();
  @Output() closeAssignEvent = new EventEmitter<void>();
  selectedUsersEvent = new EventEmitter<User[]>();

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
    private projectsService: ProjectsService
  ) {}

  closeErrorMessage(): void {
    this.errorMessage = null;
  }

  closeSuccessMessage(): void {
    this.successMessage = null;
  }

  close() {
    this.closed = true;
    this.closeAssignEvent.emit();
  }

  edit() {}

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });

    setTimeout(() => {
      this.opening = false;
    }, 100);

    this.fetchProjects();
  }

  ngAfterViewInit(): void {
    this.fetchProjects();
  }

  onSearchChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
  }

  private fetchProjects(): void {
    this.projectsService.fetchProjects().subscribe({
      next: (response: any) => {
        this.projects = response.projects || [];
      },
      error: (error: any) => {
        error;
      },
      complete: () => {},
    });
  }

  get modalClasses() {
    return {
      [`modal`]: true,
      [`opening`]: this.opening,
      [`closed`]: this.closed,
    };
  }

  get backdropClasses() {
    return {
      [`backdrop`]: true,
      [`opening`]: this.opening,
      [`closed`]: this.closed,
    };
  }

  submit(): void {
    if (this.projectForm.invalid) {
      return;
    }

    const projectName = this.projectForm.get('name')?.value;
    this.usersService
      .assignUser(
        projectName,
        this.users.map(user => user.userId)
      )
      .subscribe({
        next: (response: any) => {
          this.successMessage = response.message;
          setTimeout(() => {
            this.successMessage = null;
          }, 10000);
        },

        error: (error: any) => {
          if (error.status >= 500) {
            this.errorMessage =
              'Server Error" Something went wrong on the server.';
          } else {
            if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'An unexpected error occured.';
            }
          }

          setTimeout(() => {
            this.errorMessage = null;
          }, 10000);
        },
        complete: () => {
          this.close();
        },
      });
  }
}
