import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  //TODO:

  updateUser(id, query) {
    const body = JSON.stringify({_id: id, query: { query }});
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put('/api/v1/employee/main', body, { headers: headers});
  }

  submitClaim() {
  }
}
