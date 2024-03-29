import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AssignModalComponent } from '../../../../shared/components/modals/assign-modal/assign-modal.component';

@Component({
  selector: 'app-button-assign',
  standalone: true,
  imports: [CommonModule, AssignModalComponent],
  templateUrl: './button-assign.component.html',
  styleUrl: './button-assign.component.css',
})
export class ButtonAssignComponent {}
