import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCreationModalComponent } from '@app/shared/components/modals/project-creation-modal/project-creation-modal.component';
import { ButtonNewComponent } from '../../../user/components/button-new/button-new.component';
import { ProjectTableComponent } from '../../components/project-table/project-table.component';
import { ArchivedProjectsComponent } from '../../components/archived-projects/archived-projects.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    ButtonNewComponent,
    ProjectCreationModalComponent,
    ProjectTableComponent,
    ArchivedProjectsComponent,
    CommonModule,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent implements AfterViewInit {
  @ViewChild(ProjectTableComponent)
  projectTableComponent?: ProjectTableComponent;

  successMessage: string | null = null;

  ngAfterViewInit(): void {
    if (this.projectTableComponent) {
      this.projectTableComponent.fetchProjects();
    }
  }

  public updateProjects(): void {
    if (this.projectTableComponent) {
      this.projectTableComponent.fetchProjects();
      this.successMessage = 'Project created successfully!';

      this.projectCreationModalOpen = false;

      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
    }
  }

  public projectCreationModalOpen = false;

  public display: 'all' | 'archives' = 'all';

  private closed = false;

  private opening = true;

  public toggleDisplay(view: 'all' | 'archives'): void {
    this.display = view;
  }

  public openProjectCreationModal() {
    this.projectCreationModalOpen = true;
  }

  get toggleClasses() {
    return {
      currentview: true,
      opening: this.opening,
      closed: this.closed,
    };
  }
}
