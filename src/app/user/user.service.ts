import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  // TODO:

  updateUser(query) {
    const body = JSON.stringify(query);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put('/api/v1/user/password', body, { headers: headers});
  }

  submitClaim() {
  }
}
