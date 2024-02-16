import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ClientDetails, ProjectDetails } from '../../../types/types';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css',
})
export class ClientDetailsComponent {
  @Input() client?: ClientDetails | null = null;

  @Input() project?: ProjectDetails | null = null;

  @Input() employee?: { picture: string | null | undefined };

  constructor(public activeModal: NgbActiveModal) {}

  public closeModal(): void {
    this.activeModal.close();
  }
}
