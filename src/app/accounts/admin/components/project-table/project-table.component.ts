import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { User, ProjectDetails, GenericResponse } from '@app/shared/types/types';

import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignModalService } from '@app/shared/components/modals/assign-modal/assign.service';
import { AssignModalComponent } from '@app/shared/components/modals/assign-modal/assign-modal.component';
import { ProjectDetailsModalComponent } from '@app/shared/components/modals/project-details-modal/project-details-modal.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { DeleteProjectModalComponent } from '@app/shared/components/modals/delete-project-modal/delete-project-modal.component';
import { EditProjectModalComponent } from '@app/shared/components/modals/edit-project-modal/edit-project-modal.component';
import { ProjectCreationModalService } from '../../services/project-creation-modal.service';

import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-project-table',
  standalone: true,
  imports: [
    CommonModule,
    AssignModalComponent,
    PaginationComponent,
    EditProjectModalComponent,
  ],
  templateUrl: './project-table.component.html',
  styleUrl: './project-table.component.css',
})
export class ProjectTableComponent implements OnInit, OnDestroy {
  public totalPages = 0;

  public currentPage = 1;

  public itemsPerPage = 10;

  public projects: ProjectDetails[] = [];

  public loading = false;

  public successMessage: string | null = null;

  public errorMessage: string | null = null;

  public totalProjects = 0;

  public users: User[] = [];

  public isMenuOpen = false;

  public showDropdownForProject: ProjectDetails | null = null;

  public showTooltip = false;

  private dataSubscription: Subscription | undefined;

  private assignModalRef?: ComponentRef<AssignModalComponent>;

  constructor(
    private projectService: ProjectCreationModalService,
    private viewContainerRef: ViewContainerRef,
    private modalService: NgbModal,

    private assignModalService: AssignModalService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  public openAssignModal(project: ProjectDetails): void {
    const modalComponentRef = this.assignModalService.open(
      this.viewContainerRef
    );
    modalComponentRef.instance.project = project;
  }

  public toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public toggleDropdown(projects: ProjectDetails): void {
    this.showDropdownForProject =
      this.showDropdownForProject === projects ? null : projects;
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchProjects();
  }

  public updateProjects(): void {
    this.fetchProjects();
    this.successMessage = 'Project Edited successfully!';
  }

  fetchProjects(): void {
    this.loading = true;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    const endIndex = startIndex + this.itemsPerPage;

    this.projectService.getProjects().subscribe(
      (response: any) => {
        const projects = response.projects || response;
        if (Array.isArray(projects)) {
          this.projects = projects.slice(
            startIndex,
            endIndex
          ) as ProjectDetails[];
          this.totalProjects = projects.length;
          this.totalPages = Math.ceil(projects.length / this.itemsPerPage);
        } else {
          projects;
        }
      },
      error => {
        error;
      },
      () => {
        this.loading = false;
      }
    );
  }

  public openProjectDetailsModal(project: ProjectDetails): void {
    const modalRef = this.modalService.open(ProjectDetailsModalComponent);
    modalRef.componentInstance.project = project;
  }

  public openDeleteProjectModal(project: ProjectDetails) {
    const modalRef = this.modalService.open(DeleteProjectModalComponent);
    modalRef.componentInstance.project = project;

    modalRef.result.then(result => {
      if (result === 'delete') {
        this.deleteProject(project);
      }
    });
  }

  public deleteProject(project: ProjectDetails): void {
    const { projectId } = project;
    if (!projectId) {
      return;
    }

    this.projectService.deleteProject(projectId).subscribe({
      next: () => {
        this.successMessage = 'Project deleted successfully.';
        this.errorMessage = null;
        this.fetchProjects();
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: error => {
        this.errorMessage = 'Error deleting project.';
        this.successMessage = null;
        error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }

  private handleProjectEdited(): void {
    this.successMessage = 'Project edited successfully.';
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
    this.fetchProjects();
  }

  public openEditProjectModal(project: ProjectDetails): void {
    const modalRef = this.modalService.open(EditProjectModalComponent);
    modalRef.componentInstance.project = project;
    modalRef.componentInstance.projectEdited.subscribe(() => {
      this.handleProjectEdited();
    });
  }

  public archiveProject(projects: ProjectDetails): void {
    this.projectsService.archiveProject(projects.projectId).subscribe({
      next: (response: GenericResponse) => {
        this.successMessage = response.message;
        this.fetchProjects();
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },

      error: error => {
        if (error.status >= 500) {
          this.errorMessage =
            'Server Error: Something went wrong on the server.';
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An unexpected error occured';
        }
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }
}
