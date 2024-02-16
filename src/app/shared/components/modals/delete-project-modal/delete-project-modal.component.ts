import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectDetails } from '../../../types/types';

@Component({
  selector: 'app-delete-project-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-project-modal.component.html',
  styleUrl: './delete-project-modal.component.css',
})
export class DeleteProjectModalComponent {
  @Input() archivedProjects: ProjectDetails | null = null;

  constructor(public activeModal: NgbActiveModal) {}

  public cancelDelete() {
    this.activeModal.dismiss('cancel');
  }

  public confirmDelete() {
    this.activeModal.close('delete');
  }
}
