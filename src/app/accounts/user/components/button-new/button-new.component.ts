import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ManagerUsercreationComponent } from '@app/accounts/manager/pages/manager-usercreation/manager-usercreation.component';
import { UsercreationComponent } from '@app/accounts/admin/pages/usercreation/usercreation.component';
import { UsercreationModalService } from '../../../admin/services/usercreation-modal.service';
import { ManagerUsercreationService } from '../../../admin/services/manager-usercreation.service';

@Component({
  selector: 'app-button-new',
  standalone: true,
  imports: [CommonModule, UsercreationComponent, ManagerUsercreationComponent],
  templateUrl: './button-new.component.html',
  styleUrl: './button-new.component.css',
})
export class ButtonNewComponent {
  constructor(
    private usercreationmodalService: UsercreationModalService,
    private managerusercreationmodalService: ManagerUsercreationService
  ) {}

  openUserCreationModal() {
    this.usercreationmodalService.openUserCreationModal();
  }

  openManagerUserCreationModal() {
    this.managerusercreationmodalService.openManagerUserCreationModal();
  }
}
