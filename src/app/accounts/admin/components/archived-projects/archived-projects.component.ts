import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  GenericResponse,
  ProjectDetails,
} from '../../../../shared/types/types';
import { ProjectsService } from '../../services/projects.service';
import { DeleteProjectModalComponent } from '../../../../shared/components/modals/delete-project-modal/delete-project-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-archived-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archived-projects.component.html',
  styleUrl: './archived-projects.component.css',
})
export class ArchivedProjectsComponent implements OnInit {
  public archivedProjects: ProjectDetails[] = [];
  public loading: boolean = true;
  public showDropdownForProject: ProjectDetails | null = null;
  public successMessage: string | null = null;
  public errorMessage: string | null = null;

  constructor(
    private projectsService: ProjectsService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchArchivedProjects();
  }

  public toggleDropdown(archivedProjects: ProjectDetails): void {
    this.showDropdownForProject =
      this.showDropdownForProject === archivedProjects
        ? null
        : archivedProjects;
  }

  private fetchArchivedProjects(): void {
    this.loading = true;
    this.projectsService.archivedProjects().subscribe({
      next: (response: any) => {
        const archivedProjects = response?.archives || [];
        if (Array.isArray(archivedProjects)) {
          this.archivedProjects = archivedProjects as ProjectDetails[];
        } else {
        }
      },
      error: error => {
        error;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  public restoreProject(projectId: string): void {
    this.projectsService.restoreProject(projectId).subscribe({
      next: (response: GenericResponse) => {
        this.successMessage = response.message;
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
        this.fetchArchivedProjects();
      },

      error: () => {
        (this.errorMessage =
          'Server Error: Could not restore project, please try again later.'),
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
      },
    });
  }

  public openDeleteProjectModal(archivedproject: ProjectDetails) {
    const modalRef = this.modalService.open(DeleteProjectModalComponent);
    modalRef.componentInstance.archivedProjects = archivedproject;

    modalRef.result.then(result => {
      if (result === 'delete') {
        this.deleteProject(archivedproject);
      }
    });
  }

  public deleteProject(project: ProjectDetails): void {
    if (!project) {
      return;
    }

    this.projectsService.deleteProject(project.projectId).subscribe({
      next: () => {
        this.successMessage = 'Project deleted successfully.';
        this.errorMessage = null;
        this.fetchArchivedProjects();
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: () => {
        (this.errorMessage =
          'Server Error: Could not delete project, please try again later.'),
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
      },
    });
  }
}
