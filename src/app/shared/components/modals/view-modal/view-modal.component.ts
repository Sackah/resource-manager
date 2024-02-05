import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../types/types';

@Component({
  selector: 'view-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-modal.component.html',
  styleUrl: './view-modal.component.css',
})
export class ViewModalComponent implements OnInit {
  @Input() user!: User;
  display: 'general' | 'normal-avaliability' = 'general';
  closed = false;
  opening = true;

  @Output() closeEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<void>();

  close() {
    this.closed = true;
    this.closeEvent.emit();
  }

  edit() {}

  submit() {
    this.submitEvent.emit();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.opening = false;
    }, 100);
  }

  get modalClasses() {
    return {
      [`modal`]: true,
      [`opening`]: this.opening,
      [`closed`]: this.closed,
    };
  }

  get backdropClasses() {
    return {
      [`backdrop`]: true,
      [`opening`]: this.opening,
      [`closed`]: this.closed,
    };
  }
}
