import { Component, OnInit } from '@angular/core';
import { ClientDetails, GenericResponse } from '../../../../shared/types/types';
import { ClientCreationModalService } from '../../services/client-creation-modal.service';
import { CommonModule } from '@angular/common';
import { ClientDetailsComponent } from '../../../../shared/components/modals/client-details/client-details.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-client-table',
  standalone: true,
  imports: [CommonModule, ClientDetailsComponent, PaginationComponent],
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.css',
})
export class ClientTableComponent implements OnInit {
  public totalPages: number = 0;
  public currentPage: number = 1;
  private itemsPerPage: number = 10;
  public clients: ClientDetails[] = [];
  public loading = false;
  public successMessage: string | null = null;
  public errorMessage: string | null = null;
  public totalClients: number = 0;
  public showDropdownForClient: ClientDetails | null = null;

  constructor(
    private clientCreationModalService: ClientCreationModalService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loading = false;
    this.fetchClients();
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchClients();
  }

  public toggleDropdown(clients: ClientDetails): void {
    this.showDropdownForClient =
      this.showDropdownForClient === clients ? null : clients;
  }

  private fetchClients(): void {
    this.loading = true;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.clientCreationModalService.getClients().subscribe(
      (response: any) => {
        this.handleClientResponse(response, startIndex, endIndex);
      },
      error => {
        this.handleClientError(error);
      },
      () => {
        this.loading = false;
      }
    );
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

      error: () => {
        (this.errorMessage =
          'Server Error: Could not archive client, please try again later.'),
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
      },
    });
  }

  private handleClientResponse(
    response: any,
    startIndex: number,
    endIndex: number
  ): void {
    const clients = response.clients || response;
    if (Array.isArray(clients)) {
      this.clients = clients.slice(startIndex, endIndex) as ClientDetails[];
      this.totalClients = clients.length;
      this.totalPages = Math.ceil(clients.length / this.itemsPerPage);
    } else {
      this.handleError('Invalid response format for clients:', clients);
    }
  }

  private handleClientError(error: any): void {
    this.handleError('Error fetching clients:', error);
  }

  private handleError(message: string, errorDetails: any): void {
    message;
    this.errorMessage =
      'An error occurred while fetching clients. Please try again later.';
  }

  public openClientsDetails(client: ClientDetails): void {
    const modalRef = this.modalService.open(ClientDetailsComponent);
    modalRef.componentInstance.client = client;
  }
}
