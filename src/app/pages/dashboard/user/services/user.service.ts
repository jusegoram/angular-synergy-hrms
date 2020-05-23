import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@synergy/environments/environment';

@Injectable()
export class UserService {
  api = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  updateUser(query) {
    const body = JSON.stringify(query);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put(this.api + '/user/password', body, {
      headers: headers,
    });
  }

  submitClaim() {}
}
