import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BASE_URL } from 'src/environment/config';
import { ProjectDetails, GenericResponse } from 'src/app/shared/types/types';
import { ProjectCreationModalComponent } from '@app/shared/components/modals/project-creation-modal/project-creation-modal.component';
import { DeleteProjectModalComponent } from '@app/shared/components/modals/delete-project-modal/delete-project-modal.component';
import { EditProjectModalComponent } from '@app/shared/components/modals/edit-project-modal/edit-project-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ProjectCreationModalService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'skip-browser-warning',
  });

  constructor(
    private http: HttpClient,
    private projectcreationmodalService: NgbModal
  ) {}

  addNewProject(data: ProjectDetails): Observable<ProjectDetails> {
    return this.http.post<ProjectDetails>(`${BASE_URL}/project/store`, data, {
      headers: this.headers,
    });
  }

  editProject(data: ProjectDetails): Observable<ProjectDetails> {
    return this.http.put<ProjectDetails>(`${BASE_URL}/project/update`, data, {
      headers: this.headers,
    });
  }

  getProjects(): Observable<ProjectDetails[]> {
    return this.http.get<ProjectDetails[]>(`${BASE_URL}/project/fetch`, {
      headers: this.headers,
    });
  }

  deleteProject(projectId: string): Observable<GenericResponse> {
    const url = `${BASE_URL}/project/archives/store`;
    const params = { projectId };
    return this.http.delete<GenericResponse>(url, { params });
  }

  archivedProjectDelete(projectId: string): Observable<GenericResponse> {
    const url = `${BASE_URL}/project/archives/delete`;
    const params = { projectId };
    return this.http.delete<GenericResponse>(url, { params });
  }

  openProjectCreationModal(): NgbModalRef {
    const modalRef = this.projectcreationmodalService.open(
      ProjectCreationModalComponent,
      {
        centered: true,
        backdrop: 'static',
      }
    );

    return modalRef;
  }

  openEditProjectModal(project: ProjectDetails): NgbModalRef {
    const modalRef = this.projectcreationmodalService.open(
      EditProjectModalComponent,
      {
        centered: true,
        backdrop: 'static',
      }
    );

    modalRef.componentInstance.project = project;

    return modalRef;
  }

  openDeleteProjectModal(): NgbModalRef {
    const modalRef = this.projectcreationmodalService.open(
      DeleteProjectModalComponent,
      {
        centered: true,
        backdrop: 'static',
      }
    );

    return modalRef;
  }
}
