import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPDataResponse } from '@app/shared/types/types';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root',
})
export class IPDataService {
  constructor(private http: HttpClient) {}

  getIPData(): Observable<IPDataResponse> {
    return this.http.get<IPDataResponse>(
      `https://api.ipdata.co?api-key=${environment.ApiKey}`
    );
  }
}
