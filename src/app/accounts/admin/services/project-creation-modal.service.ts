import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../../environment/config';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProjectDetails, GenericResponse } from '../../../shared/types/types';
import { ProjectCreationModalComponent } from '../../../shared/components/modals/project-creation-modal/project-creation-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ProjectCreationModalService {
  constructor(
    private http: HttpClient,
    private projectcreationmodalService: NgbModal
  ) {}

  addNewProject(data: ProjectDetails): Observable<ProjectDetails> {
    return this.http.post<ProjectDetails>(`${BASE_URL}/project/store`, data, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning',
      },
    });
  }
  editProject(data: ProjectDetails): Observable<ProjectDetails> {
    return this.http.put<ProjectDetails>(`${BASE_URL}/project/update`, data, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning',
      },
    });
  }

  getProjects(): Observable<ProjectDetails[]> {
    return this.http.get<ProjectDetails[]>(`${BASE_URL}/project/fetch`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning',
      },
    });
  }

  deleteProject(projectId: string): Observable<GenericResponse> {
    const url = `${BASE_URL}/project/archives/store`;
    const params = { projectId: projectId };
    return this.http.delete<GenericResponse>(url, { params: params });
  }

  archivedProjectDelete(projectId: string): Observable<GenericResponse> {
    const url = `${BASE_URL}/project/archives/delete`;
    const params = { projectId: projectId };
    return this.http.delete<GenericResponse>(url, { params: params });
  }

  openProjectCreationModal(): NgbModalRef {
    const modalRef = this.projectcreationmodalService.open(
      ProjectCreationModalComponent,
      {
        centered: true,
        backdrop: 'static',
      }
    );

    modalRef.result.finally(() => {});

    return modalRef;
  }
  openEditProjectModal(): NgbModalRef {
    const modalRef = this.projectcreationmodalService.open(
      ProjectCreationModalComponent,
      {
        centered: true,
        backdrop: 'static',
      }
    );

    modalRef.result.finally(() => {});

    return modalRef;
  }
  openDeleteProjectModal(): NgbModalRef {
    const modalRef = this.projectcreationmodalService.open(
      ProjectCreationModalComponent,
      {
        centered: true,
        backdrop: 'static',
      }
    );

    modalRef.result.finally(() => {});

    return modalRef;
  }
}
