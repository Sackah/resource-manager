import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ArchivedProjectsComponent } from '@app/accounts/admin/components/archived-projects/archived-projects.component';
import { ButtonNewComponent } from '@app/accounts/user/components/button-new/button-new.component';
import { ProjectCreationModalComponent } from '@app/shared/components/modals/project-creation-modal/project-creation-modal.component';
import { ProjectTableComponent } from '@app/accounts/admin/components/project-table/project-table.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCreationModalComponent,
    ProjectTableComponent,
    ButtonNewComponent,
    ArchivedProjectsComponent,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent {
  projectCreationModalOpen = false;

  public display: 'all' | 'archives' = 'all';

  public closed = false;

  public opening = true;

  toggleDisplay(view: 'all' | 'archives'): void {
    this.display = view;
  }

  openProjectCreationModal() {
    this.projectCreationModalOpen = true;
  }
}
