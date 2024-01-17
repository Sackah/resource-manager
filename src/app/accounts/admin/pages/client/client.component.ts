import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonNewComponent } from '../../../user/components/button-new/button-new.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, ButtonNewComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent {
  display: 'all' | 'archives' = 'all';
  closed: boolean = false;
  opening: boolean = true;

  get toggleClasses() {
    return {
      [`currentview`]: true,
      [`opening`]: this.opening,
      [`closed`]: this.closed,
    };
  }
}
