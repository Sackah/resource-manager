import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BASE_URL } from 'src/environment/config';
import { ClientCreationModalComponent } from '@app/shared/components/modals/client-creation-modal/client-creation-modal.component';
import { EditClientModalComponent } from '@app/shared/components/modals/edit-client-modal/edit-client-modal.component';
import { ClientDetails, GenericResponse } from '../../../shared/types/types';

@Injectable({
  providedIn: 'root',
})
export class ClientCreationModalService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'skip-browser-warning',
  });

  constructor(
    private http: HttpClient,
    private clientcreationmodalService: NgbModal
  ) {}

  clientCreated: EventEmitter<ClientDetails> =
    new EventEmitter<ClientDetails>();

  addNewClient(data: ClientDetails | null): Observable<ClientDetails> {
    return this.http
      .post<ClientDetails>(`${BASE_URL}/client/store`, data, {
        headers: this.headers,
      })
      .pipe(
        tap((newClient: ClientDetails) => {
          this.clientCreated.next(newClient);
        })
      );
  }

  editClient(data: ClientDetails | null): Observable<ClientDetails> {
    return this.http
      .put<ClientDetails>(`${BASE_URL}/client/update`, data, {
        headers: this.headers,
      })
      .pipe(
        tap((newClient: ClientDetails) => {
          this.clientCreated.next(newClient);
        })
      );
  }

  openEditClientModal(client: ClientDetails): NgbModalRef {
    const modalRef = this.clientcreationmodalService.open(
      EditClientModalComponent,
      {
        centered: true,
        backdrop: 'static',
      }
    );

    modalRef.componentInstance.client = client;

    return modalRef;
  }

  getAllClient(): Observable<ClientDetails[]> {
    return this.http
      .get<ClientDetails[]>(`${BASE_URL}/client/fetch`, {
        headers: this.headers,
      })
      .pipe(
        catchError(error => {
          throw error;
        }),
        map(response => response)
      );
  }

  getClients(): Observable<{ clients: ClientDetails[] }> {
    return this.http
      .get<{ clients: ClientDetails[] }>(`${BASE_URL}/client/fetch`, {
        headers: this.headers,
      })
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }

  archiveClient(clientId: string): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(`${BASE_URL}/client/delete`, {
      headers: this.headers,
      params: {
        clientId,
      },
    });
  }

  archivedClients(): Observable<ClientDetails[]> {
    return this.http.get<ClientDetails[]>(`${BASE_URL}/client/archives/fetch`, {
      headers: this.headers,
    });
  }

  restoreClient(clientId: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(
      `${BASE_URL}/client/archives/restore`,
      {
        clientId,
      }
    );
  }

  openClientCreationModal(): NgbModalRef {
    const modalRef = this.clientcreationmodalService.open(
      ClientCreationModalComponent,
      {
        centered: true,
        backdrop: 'static',
      }
    );

    return modalRef;
  }

  deleteClient(clientId: string): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(
      `${BASE_URL}/client/archives/delete`,
      {
        headers: this.headers,
        params: {
          clientId,
        },
      }
    );
  }
}
