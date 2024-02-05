import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../../../shared/types/types';
import {
  ProjectDetails,
  GenericResponse,
} from '../../../../shared/types/types';
import { AssignModalService } from '../../../../shared/components/modals/assign-modal/assign.service';
import { AssignModalComponent } from '../../../../shared/components/modals/assign-modal/assign-modal.component';
import { ProjectCreationModalService } from '../../services/project-creation-modal.service';
import { CommonModule } from '@angular/common';
import { ProjectDetailsModalComponent } from '../../../../shared/components/modals/project-details-modal/project-details-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ProjectsService } from '../../services/projects.service';
import { DeleteProjectModalComponent } from '../../../../shared/components/modals/delete-project-modal/delete-project-modal.component';
import { EditProjectModalComponent } from '../../../../shared/components/modals/edit-project-modal/edit-project-modal.component';

@Component({
  selector: 'app-project-table',
  standalone: true,
  imports: [CommonModule, AssignModalComponent, PaginationComponent],
  templateUrl: './project-table.component.html',
  styleUrl: './project-table.component.css',
})
export class ProjectTableComponent implements OnInit, OnDestroy {
  totalPages: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  projects: ProjectDetails[] = [];
  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  totalProjects: number = 0;
  users: User[] = [];
  isMenuOpen: boolean = false;
  showDropdownForProject: ProjectDetails | null = null;
  showTooltip: boolean = false;

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

  openAssignModal(project: ProjectDetails): void {
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

  openEditProjectModal(project: ProjectDetails): void {
    const modalRef = this.modalService.open(EditProjectModalComponent);
    modalRef.componentInstance.project = project;
  }

  archiveProject(projects: ProjectDetails): void {
    this.projectsService.archiveProject(projects.projectId).subscribe({
      next: (response: GenericResponse) => {
        this.successMessage = response.message;
        this.fetchProjects();
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },

      error: () => {
        (this.errorMessage =
          'Server Error: Could not archive project, please try again later.'),
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
      },
    });
  }
}
