import { DOCUMENT } from '@angular/common';
import {
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import { EditAvailabilityModalComponent } from './edit-availability-modal.component';
import { User } from '../../../types/types';

@Injectable({
  providedIn: 'root',
})
export class EditAvailabilityService {
  constructor(
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {}

  open(
    viewContainerRef: ViewContainerRef,
    options?: {
      user?: User;
      selectedProject?: { name: string; workHours: number; scheduleId: number };
    }
  ) {
    const modalComponentRef = viewContainerRef.createComponent(
      EditAvailabilityModalComponent,
      {
        injector: this.injector,
      }
    );
    if (options?.user) {
      modalComponentRef.instance.user = options.user;
    }
    if (options?.selectedProject) {
      modalComponentRef.instance.selectedProject = options.selectedProject;
    }

    modalComponentRef.instance.closeEvent.subscribe(() =>
      this.closeModal(modalComponentRef)
    );
    modalComponentRef.instance.submitEvent.subscribe(() =>
      this.submitModal(modalComponentRef)
    );
    this.document.body.appendChild(modalComponentRef.location.nativeElement);

    return modalComponentRef;
  }

  closeModal(modalComponentRef: ComponentRef<EditAvailabilityModalComponent>) {
    setTimeout(() => {
      modalComponentRef.destroy();
    }, 400);
  }

  submitModal(modalComponentRef: ComponentRef<EditAvailabilityModalComponent>) {
    modalComponentRef.destroy();
  }
}
