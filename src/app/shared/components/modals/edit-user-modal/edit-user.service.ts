import { DOCUMENT } from '@angular/common';
import {
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import { EditUserModalComponent } from './edit-user-modal.component'; // Make sure to adjust the path
import { User } from '../../../types/types';

@Injectable({
  providedIn: 'root',
})
export class EditUserModalService {
  constructor(
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {}

  open(viewContainerRef: ViewContainerRef, options?: { user?: User }) {
    const modalComponentRef = viewContainerRef.createComponent(
      EditUserModalComponent,
      {
        injector: this.injector,
      }
    );
    if (options?.user) {
      modalComponentRef.instance.user = options.user;
      modalComponentRef.instance.setValues(); // Assuming you have a method to set initial values
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

  closeModal(modalComponentRef: ComponentRef<EditUserModalComponent>) {
    setTimeout(() => {
      modalComponentRef.destroy();
    }, 400);
  }

  submitModal(modalComponentRef: ComponentRef<EditUserModalComponent>) {
    modalComponentRef.instance.submitForm(); // Assuming you have a submitForm method
    // Add any additional logic you need upon submitting the modal
    modalComponentRef.destroy();
  }
}
