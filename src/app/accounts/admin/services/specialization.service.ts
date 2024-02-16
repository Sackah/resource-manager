import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from 'src/environment/config';
import { SpecializationModalComponent } from '@app/shared/components/modals/specialization-modal/specialization-modal.component';

import { specializationResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'skip-browser-warning',
  });

  private _specializations: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);

  specializations$ = this._specializations.asObservable();

  constructor(
    private http: HttpClient,
    private specializationService: NgbModal
  ) {
    this._specializations.next([]);
  }

  openSpecializationModal(): NgbModalRef {
    const modalRef = this.specializationService.open(
      SpecializationModalComponent,
      {
        centered: true,
        backdrop: 'static',
      }
    );

    return modalRef;
  }

  addSpecialization(
    specialization: string
  ): Observable<specializationResponse> {
    const currentSpecializations = this._specializations.getValue();

    return this.http
      .post<any>(`${BASE_URL}/specialization/store`, { name: specialization })
      .pipe(
        catchError(error => {
          this._specializations.next(currentSpecializations);

          return throwError(error);
        })
      );
  }

  getSpecializations(): Observable<string[]> {
    return this.http
      .get<string[]>(`${BASE_URL}/specialization/fetch`, {
        headers: this.headers,
      })

      .pipe(catchError(error => throwError(error)));
  }

  setSpecializations(specializations: string[]) {
    this._specializations.next(specializations);
  }
}
