import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ClientDetails, ProjectDetails } from '../../../types/types';
import { ClientCreationModalService } from '../../../../accounts/admin/services/client-creation-modal.service';
import { ProjectCreationModalService } from '../../../../accounts/admin/services/project-creation-modal.service';
import { ClientCreationModalComponent } from '../client-creation-modal/client-creation-modal.component';

@Component({
  selector: 'app-edit-project-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ClientCreationModalComponent],
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['./edit-project-modal.component.css'],
})
export class EditProjectModalComponent implements OnInit, OnChanges {
  @Output() projectEdited: EventEmitter<void> = new EventEmitter<void>();

  @Input() isOpen = true;

  @Input() project!: ProjectDetails;

  clientCreationModalOpen = false;

  showClientDropdown = false;

  formData: FormGroup;

  public loading = false;

  public success = false;

  public error = false;

  public errorMessages: { serverError?: string } = {};

  public successMessage = '';

  public clients: ClientDetails[] = [];

  public filteredClients: ClientDetails[] = [];

  public date: Date | undefined;

  public newClientDetails: ClientDetails = {} as ClientDetails;

  constructor(
    private projectcreationService: ProjectCreationModalService,
    private clientService: ClientCreationModalService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {
    this.formData = this.fb.group({
      details: [''],
      name: [''],
      clientId: [''],

      clientSearch: [''],
      startDate: [''],
      endDate: [''],
      projectType: [''],
      billable: [false],
      projectId: [''],
    });
  }

  ngOnInit(): void {
    this.populateForm();
    this.fetchClients();

    this.formData
      .get('clientSearch')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.filterClients());
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.project && !changes.project.firstChange) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (this.project) {
      this.formData.patchValue({
        details: this.project.details,
        name: this.project.name,

        clientSearch: this.project.client,
        clientId: this.project.clientId,
        startDate: this.project.startDate
          ? new Date(this.project.startDate).toISOString().split('T')[0]
          : null,
        endDate: this.project.endDate
          ? new Date(this.project.endDate).toISOString().split('T')[0]
          : null,
        projectType: this.project.projectType ? 'internal' : 'external',
        billable: this.project.billable === true,
        projectId: this.project.projectId,
      });
    }
  }

  public OnEditProject(): void {
    this.loading = true;
    this.success = false;
    this.error = false;
    this.errorMessages = {};

    if (this.formData.valid) {
      const formDataValue = this.formData.value;

      const { startDate } = formDataValue;
      const { endDate } = formDataValue;
      const projectStatus = formDataValue['project-status'];
      const { billable } = formDataValue;

      const isBillable = billable === true;

      this.loading = true;

      const projectData = {
        details: formDataValue.details,
        name: formDataValue.name,
        client: formDataValue.client,
        date: formDataValue.date,
        startDate,
        endDate,
        projectStatus,
        billable: isBillable,
      };

      this.projectcreationService
        .editProject(formDataValue)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(
          () => {
            this.formData.reset();
            this.success = true;
            this.successMessage = 'Project edited successfully!';
            this.closeEditProjectModal();
            this.projectEdited.emit();
          },
          error => {
            this.error = true;
            if (error.status >= 500) {
              this.errorMessages.serverError =
                'Server Error" Something went wrong on the server.';
            } else if (error.error && error.error.message) {
              this.errorMessages.serverError = error.error.message;
            } else {
              this.errorMessages.serverError = 'An unexpected error occured.';
            }
            this.formData.markAsTouched();
          }
        );
    } else {
      this.errorMessages.serverError =
        'Please enter valid inputs or complete the form';
    }
  }

  closeEditProjectModal(): void {
    this.isOpen = false;
  }

  openClientCreationModal(): void {
    this.clientService.openClientCreationModal();
  }

  clearErrorMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessage;
      this.errorMessages.serverError;
    }, 2500);
  }

  private fetchClients(): void {
    this.clientService
      .getClients()
      .subscribe((response: { clients: ClientDetails[] }) => {
        if (Array.isArray(response.clients)) {
          this.clients = response.clients;
          this.filteredClients = response.clients;
        } else {
          this.handleError('Error retrieving clients. Please try again later.');
        }
      });

    this.clientService.clientCreated.subscribe(
      (updatedClient: ClientDetails) => {
        this.clients.push(updatedClient.client);

        this.filterClients();
      }
    );
  }

  private handleError(errorMessage: string): void {
    this.error = true;
    this.errorMessages.serverError = errorMessage;
  }

  public filterClients(): void {
    const searchTerm = this.formData.get('clientSearch')!.value;
    if (this.clients && Array.isArray(this.clients)) {
      this.filteredClients = this.clients.filter(
        client =>
          client &&
          client.name &&
          typeof client.name === 'string' &&
          client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  public selectClient(client: ClientDetails): void {
    if (this.formData.get('clientSearch')) {
      this.formData.get('clientId')!.setValue(client.clientId);
      this.formData.get('clientSearch')!.setValue(client.name);
      this.showClientDropdown = false;
    }
  }

  public handleClientCreated(updatedData: { client: ClientDetails }): void {
    this.clients.push(updatedData.client);

    this.filterClients();
    this.cdr.detectChanges();
  }
}
