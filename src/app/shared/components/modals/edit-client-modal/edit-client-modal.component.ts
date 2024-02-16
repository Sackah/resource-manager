import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { ClientCreationModalService } from '../../../../accounts/admin/services/client-creation-modal.service';
import { ClientDetails } from '../../../types/types';
import { ProjectCreationModalComponent } from '../project-creation-modal/project-creation-modal.component';

@Component({
  selector: 'app-edit-client-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProjectCreationModalComponent],
  templateUrl: './edit-client-modal.component.html',
  styleUrl: './edit-client-modal.component.css',
})
export class EditClientModalComponent implements OnInit, OnChanges {
  @Input() isOpen = true;

  @Input() client!: ClientDetails;

  @Output() clientEdited: EventEmitter<void> = new EventEmitter<void>();

  public formData: FormGroup;

  public loading = false;

  public success = false;

  public error = false;

  public errorMessage = '';

  public successMessage = '';

  public nullFormControlMessage = '';

  public formInvalidMessage = '';

  constructor(
    private clienteditingService: ClientCreationModalService,

    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.formData = this.fb.group({
      details: [''],
      name: [''],
      clientId: [''],
    });
  }

  clearErrorMessagesAfterDelay() {
    setTimeout(() => {
      this.errorMessage = '';
      this.formInvalidMessage = '';
      this.nullFormControlMessage = '';
    }, 3000);
  }

  public onEditClient() {
    this.loading = false;
    this.success = false;
    this.error = false;

    if (this.formData.valid) {
      this.loading = true;

      this.clienteditingService
        .editClient(this.formData.value)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(
          updatedClients => {
            this.success = true;
            this.successMessage = 'Client Edited successfully!';
            this.clientEdited.emit();
            this.closeClientEditModal();
          },
          error => {
            this.error = true;
            if (error.status >= 500) {
              this.errorMessage =
                'Server Error" Something went wrong on the server.';
            } else if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'An unexpected error occured.';
            }
            this.clearErrorMessagesAfterDelay();
          }
        );
    } else {
      this.formInvalidMessage =
        'Please complete the form or enter valid inputs';
      this.clearErrorMessagesAfterDelay();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.client) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (this.client) {
      this.formData.patchValue({
        details: this.client.details,
        name: this.client.name,
        clientId: this.client.clientId,
      });
    }
  }

  closeClientEditModal() {
    this.isOpen = false;
  }

  ngOnInit(): void {
    this.populateForm();
  }
}
