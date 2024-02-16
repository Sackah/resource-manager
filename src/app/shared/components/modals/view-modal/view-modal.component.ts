import { CommonModule } from '@angular/common';
import {
  Component,
  ViewContainerRef,
  ComponentRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { UsersService } from '@app/accounts/admin/services/users.service';
import { User } from '../../../types/types';
import { EditAvailabilityModalComponent } from '../edit-availability-modal/edit-availability-modal.component';
import { EditAvailabilityService } from '../edit-availability-modal/edit-availability.service';
import { AvailabilityService } from '../edit-availability-modal/availability.service';

@Component({
  selector: 'app-view-modal',
  standalone: true,
  imports: [CommonModule, EditAvailabilityModalComponent],
  templateUrl: './view-modal.component.html',
  styleUrl: './view-modal.component.css',
})
export class ViewModalComponent implements OnInit {
  @Input() user!: User;

  display: 'general' | 'normal-avaliability' = 'general';

  closed = false;

  opening = true;

  successMessage: string | null = null;

  errorMessage: string | null = null;

  @Output() closeEvent = new EventEmitter<void>();

  @Output() submitEvent = new EventEmitter<void>();

  private availabilityModalRef?: ComponentRef<EditAvailabilityModalComponent>;

  constructor(
    private usersService: UsersService,
    private viewContainerRef: ViewContainerRef,
    private availabilityService: AvailabilityService,
    private editAvailablityService: EditAvailabilityService
  ) {}

  close() {
    this.closed = true;
    this.closeEvent.emit();
  }

  submit() {
    this.submitEvent.emit();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.opening = false;
    }, 100);
  }

  public openEditAvailabilityModal(
    user: User,
    selectedProject: { name: string; workHours: number; scheduleId: number }
  ) {
    this.availabilityModalRef = this.editAvailablityService.open(
      this.viewContainerRef,
      { user, selectedProject }
    );
  }

  calculateTotalHours(user: User): number {
    return user.workHours.reduce(
      (totalHours: number, workInfo) => totalHours + workInfo.hour,
      0
    );
  }

  getTotalHours(): number {
    return this.user.workHours.reduce(
      (total, workInfo) => total + workInfo.hour,
      0
    );
  }

  get modalClasses() {
    return {
      modal: true,
      opening: this.opening,
      closed: this.closed,
    };
  }

  get backdropClasses() {
    return {
      backdrop: true,
      opening: this.opening,
      closed: this.closed,
    };
  }
}
