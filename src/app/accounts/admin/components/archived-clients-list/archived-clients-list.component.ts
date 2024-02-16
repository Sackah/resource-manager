import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ClientDetails, GenericResponse } from '@app/shared/types/types';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteClientModalComponent } from '@app/shared/components/modals/delete-client-modal/delete-client-modal.component';
import { ClientCreationModalService } from '../../services/client-creation-modal.service';

@Component({
  selector: 'app-archived-clients-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archived-clients-list.component.html',
  styleUrls: [
    './archived-clients-list.component.css',
    '../../../../auth/styles/styles.css',
  ],
})
export class ArchivedClientsListComponent implements OnInit {
  public loading = true;

  public showDropdownForClient: ClientDetails | null = null;

  public successMessage: string | null = null;

  public errorMessage: string | null = null;

  public archivedClients: ClientDetails[] = [];

  public currentPageS = 1;

  public itemsPerPage = 10;

  public totalPages = 0;

  constructor(
    private clientCreationModalService: ClientCreationModalService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchArchivedClients();
  }

  public toggleDropdown(archivedClients: ClientDetails): void {
    this.showDropdownForClient =
      this.showDropdownForClient === archivedClients ? null : archivedClients;
  }

  private fetchArchivedClients(): void {
    this.loading = true;
    this.clientCreationModalService.archivedClients().subscribe({
      next: response => {
        const archivedClients = response || [];
        if (Array.isArray(archivedClients)) {
          this.archivedClients = archivedClients as ClientDetails[];
        } else {
          this.archivedClients = [];
        }
      },

      complete: () => {
        this.loading = false;
      },
    });
  }

  public restoreClient(clientId: string): void {
    this.loading = true;
    this.clientCreationModalService.restoreClient(clientId).subscribe({
      next: (response: GenericResponse) => {
        this.successMessage = response.message;
        this.fetchArchivedClients();

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: () => {
        this.errorMessage =
          'Server Error: Could not restore client, please try again later.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }

  public openDeleteClientModal(archivedclient: ClientDetails) {
    const modalRef = this.modalService.open(DeleteClientModalComponent);
    modalRef.componentInstance.archivedClients = archivedclient;

    modalRef.result.then(result => {
      if (result === 'delete') {
        this.deleteClient(archivedclient);
      }
    });
  }

  private deleteClient(client: ClientDetails): void {
    if (!client) {
      return;
    }

    this.clientCreationModalService.deleteClient(client.clientId).subscribe({
      next: (response: GenericResponse) => {
        this.successMessage = response.message;
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
        this.fetchArchivedClients();
      },
      error: () => {
        this.errorMessage =
          'Server Error: Could not delete client, please try again later.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }
}
