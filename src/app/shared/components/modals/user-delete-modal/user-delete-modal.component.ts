import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../types/types';

@Component({
  selector: 'app-user-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-delete-modal.component.html',
  styleUrl: './user-delete-modal.component.css',
})
export class UserDeleteModalComponent {
  @Input() archivedUser: User | null = null;

  constructor(public activeModal: NgbActiveModal) {}

  public cancelDelete() {
    this.activeModal.dismiss('cancel');
  }

  public confirmDelete() {
    this.activeModal.close('delete');
  }
}
