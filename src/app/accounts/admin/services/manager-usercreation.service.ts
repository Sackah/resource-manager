import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ManagerUsercreationComponent } from '../../manager/pages/manager-usercreation/manager-usercreation.component';
import { User } from '../../../shared/types/types';
import { BASE_URL } from '../../../../environment/config';

@Injectable({
  providedIn: 'root',
})
export class ManagerUsercreationService {
  constructor(
    private http: HttpClient,
    private managerusercreationmodalService: NgbModal
  ) {}

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${BASE_URL}/users/store`, user);
  }

  openManagerUserCreationModal(): NgbModalRef {
    const modalRef = this.managerusercreationmodalService.open(
      ManagerUsercreationComponent,
      {
        centered: true,
        backdrop: 'static',
      }
    );

    return modalRef;
  }
}
