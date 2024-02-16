import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../../environment/config';
import {
  Projects,
  GenericResponse,
  ArchivedProjectsResponse,
} from '../../../shared/types/types';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'skip-browser-warning',
  });

  constructor(private http: HttpClient) {}

  fetchProjects(): Observable<Projects[]> {
    return this.http.get<Projects[]>(`${BASE_URL}/project/fetch`, {
      headers: this.headers,
    });
  }

  archiveProject(projectId: string): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(`${BASE_URL}/project/delete`, {
      headers: this.headers,
      params: {
        projectId,
      },
    });
  }

  archivedProjects(): Observable<ArchivedProjectsResponse> {
    return this.http.get<ArchivedProjectsResponse>(
      `${BASE_URL}/project/archives/fetch`,
      {
        headers: this.headers,
      }
    );
  }

  restoreProject(projectId: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(
      `${BASE_URL}/project/archives/restore`,
      { projectId }
    );
  }

  deleteProject(projectId: string): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(
      `${BASE_URL}/project/archives/delete`,
      {
        headers: this.headers,
        params: {
          projectId,
        },
      }
    );
  }
}
