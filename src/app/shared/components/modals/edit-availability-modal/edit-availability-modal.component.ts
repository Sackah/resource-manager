import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { UsersService } from '@app/accounts/admin/services/users.service';
import { User } from '@app/shared/types/types';

@Component({
  selector: 'app-edit-availability-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-availability-modal.component.html',
  styleUrl: './edit-availability-modal.component.css',
})
export class EditAvailabilityModalComponent implements OnInit {
  closed = false;

  opening = true;

  successMessage = '';

  errorMessage = '';

  isLoading = false;

  @Input() user: User | null = null;

  @Output() closeEvent = new EventEmitter<void>();

  @Output() submitEvent = new EventEmitter<void>();

  @Input() selectedProject: {
    name: string;
    workHours: number;
    scheduleId: number;
  } | null = null;

  editSchedule: FormGroup = new FormGroup({
    refId: new FormControl('', [Validators.required]),
    scheduleId: new FormControl('', [Validators.required]),
    workHours: new FormControl('', [Validators.required]),
    project: new FormControl('', [Validators.required]),
  });

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.setValues();
    setTimeout(() => {
      this.opening = false;
    }, 100);
  }

  setValues() {
    if (this.user && this.selectedProject) {
      this.editSchedule.patchValue({
        project: this.selectedProject ? this.selectedProject : '',
        workHours: this.selectedProject.workHours
          ? this.selectedProject.workHours
          : '',
        scheduleId: this.selectedProject.scheduleId
          ? this.selectedProject.scheduleId
          : '',
      });
    }
  }

  close() {
    this.closed = true;
    this.closeEvent.emit();
  }

  submit() {
    const scheduleId = this.editSchedule.get('scheduleId')?.value;
    const workHours = this.editSchedule.get('workHours')?.value;

    if (!scheduleId || !workHours || !this.user) {
      return;
    }
    this.isLoading = true;
    this.usersService
      .editProjectWorkHours(scheduleId, workHours, this.user)
      .subscribe({
        next: response => {
          this.successMessage = response.message;
          this.submitEvent.emit();
          this.isLoading = false;
        },
        error: error => {
          this.errorMessage = error.error.message;
          this.isLoading = false;
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
