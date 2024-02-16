import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditClientModalComponent } from '@app/shared/components/modals/edit-client-modal/edit-client-modal.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { ClientDetailsComponent } from '@app/shared/components/modals/client-details/client-details.component';
import { ClientDetails, GenericResponse } from '@app/shared/types/types';
import { ClientCreationModalService } from '../../services/client-creation-modal.service';

@Component({
  selector: 'app-client-table',
  standalone: true,
  imports: [
    CommonModule,
    ClientDetailsComponent,
    PaginationComponent,
    EditClientModalComponent,
  ],
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.css',
})
export class ClientTableComponent implements OnInit {
  public totalPages = 0;

  public currentPage = 1;

  private itemsPerPage = 10;

  public clients: ClientDetails[] = [];

  public loading = false;

  public successMessage: string | null = null;

  public errorMessage: string | null = null;

  public totalClients = 0;

  public showDropdownForClient: ClientDetails | null = null;

  constructor(
    private clientCreationModalService: ClientCreationModalService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchClients();
    this.clientCreationModalService.getAllClient().subscribe(response => {});
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchClients();
  }

  public toggleDropdown(clients: ClientDetails): void {
    this.showDropdownForClient =
      this.showDropdownForClient === clients ? null : clients;
  }

  public fetchClients(): void {
    this.loading = true;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.clientCreationModalService.getClients().subscribe({
      next: response => {
        const clients = response.clients || response;
        if (Array.isArray(clients)) {
          this.clients = clients.slice(startIndex, endIndex) as ClientDetails[];
          this.totalClients = clients.length;
          this.totalPages = Math.ceil(clients.length / this.itemsPerPage);
        } else {
          this.errorMessage = 'An unexpected error occured';
        }
      },
      error: () => {
        this.handleClientError();
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  public archiveClient(clients: ClientDetails): void {
    this.loading = true;
    this.clientCreationModalService.archiveClient(clients.clientId).subscribe({
      next: (response: GenericResponse) => {
        this.successMessage = response.message;
        this.fetchClients();
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },

      error: error => {
        if (error.status >= 500) {
          this.errorMessage =
            'Server Error: Something went wrong on the server.';
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An unexpected error occured';
        }
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }

  private handleClientError(): void {
    this.errorMessage =
      'An error occurred while fetching clients. Please try again later.';
  }

  public openClientsDetails(client: ClientDetails): void {
    const modalRef = this.modalService.open(ClientDetailsComponent);
    modalRef.componentInstance.client = client;
  }

  public openEditClientModal(client: ClientDetails): void {
    const modalRef = this.modalService.open(EditClientModalComponent);
    modalRef.componentInstance.client = client;
    modalRef.componentInstance.clientEdited.subscribe(() => {
      this.handleClientEdited();
    });
  }

  public handleClientEdited(): void {
    this.successMessage = 'Client edited successfully.';
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
    this.fetchClients();
  }
}
