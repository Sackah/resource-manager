import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GenericResponse } from '@app/shared/types/types';
import { DepartmentModalComponent } from '@app/shared/components/modals/department-modal/department-modal.component';
import { BASE_URL } from 'src/environment/config';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'skip-browser-warning',
  });

  private _departments: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);

  departments$ = this._departments.asObservable();

  constructor(private http: HttpClient, private departmentService: NgbModal) {
    this._departments.next([]);
  }

  openDepartmentModal(): NgbModalRef {
    const modalRef = this.departmentService.open(DepartmentModalComponent, {
      centered: true,
      backdrop: 'static',
    });

    return modalRef;
  }

  addDepartment(department: string): Observable<GenericResponse> {
    const currentDepartments = this._departments.getValue();

    return this.http
      .post<GenericResponse>(`${BASE_URL}/department/store`, {
        name: department,
      })
      .pipe(
        catchError(error => {
          this._departments.next(currentDepartments);
          return throwError(error);
        })
      );
  }

  getDepartments(): Observable<string[]> {
    return this.http
      .get<string[]>(`${BASE_URL}/department/fetch`, {
        headers: this.headers,
      })
      .pipe(catchError(error => throwError(error)));
  }

  setDepartments(departments: string[]) {
    this._departments.next(departments);
  }
}
