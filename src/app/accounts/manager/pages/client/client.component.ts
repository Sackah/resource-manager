import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ArchivedClientsListComponent } from '@app/accounts/admin/components/archived-clients-list/archived-clients-list.component';
import { ButtonNewComponent } from '@app/accounts/user/components/button-new/button-new.component';
import { ClientCreationModalComponent } from '@app/shared/components/modals/client-creation-modal/client-creation-modal.component';
import { ClientTableComponent } from '@app/accounts/admin/components/client-table/client-table.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    CommonModule,
    ClientCreationModalComponent,
    ClientTableComponent,
    ButtonNewComponent,
    ArchivedClientsListComponent,
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent {
  clientCreationModalOpen = false;

  public display: 'all' | 'archives' = 'all';

  public closed = false;

  public opening = true;

  toggleDisplay(view: 'all' | 'archives'): void {
    this.display = view;
  }

  openClientCreationModal() {
    this.clientCreationModalOpen = true;
  }
}
