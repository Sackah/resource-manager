import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientCreationModalService } from '../../../../accounts/admin/services/client-creation-modal.service';
import { ClientDetails } from '../../../types/types';
import { ProjectCreationModalComponent } from '../project-creation-modal/project-creation-modal.component';

@Component({
  selector: 'app-client-creation-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProjectCreationModalComponent],
  templateUrl: './client-creation-modal.component.html',
  styleUrl: './client-creation-modal.component.css',
})
export class ClientCreationModalComponent {
  @Input() isOpen = true;

  @Output() clientCreated: EventEmitter<ClientDetails> = new EventEmitter();

  @Output() newClientCreated: EventEmitter<void> = new EventEmitter<void>();

  formData: FormGroup = this.fb.group({
    details: [''],
    name: [''],
  });

  public loading = false;

  public success = false;

  public error = false;

  public errorMessage = '';

  public successMessage = '';

  public nullFormControlMessage = '';

  formInvalidMessage = '';

  constructor(
    private clientcreationService: ClientCreationModalService,

    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}

  clearErrorMessagesAfterDelay() {
    setTimeout(() => {
      this.errorMessage = '';
      this.formInvalidMessage = '';
      this.nullFormControlMessage = '';
    }, 3000);
  }

  public onCreateClient() {
    this.loading = false;
    this.success = false;
    this.error = false;

    if (this.formData.valid) {
      this.loading = true;

      this.clientcreationService
        .addNewClient(this.formData.value)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(
          updatedClients => {
            this.success = true;
            this.successMessage = 'Client created successfully!';
            this.newClientCreated.emit();
            this.clientCreated.emit(updatedClients.client);
            this.formData.reset();
            this.closeClientcreationModal();
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

  public closeClientcreationModal() {
    this.isOpen = false;
  }
}
