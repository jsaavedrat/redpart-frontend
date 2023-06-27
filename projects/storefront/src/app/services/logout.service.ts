import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  PATH_OF_API = 'http://127.0.0.1:8000/api';
  
  constructor(private http: HttpClient) {}

  logout(token: string) {
    const url = this.PATH_OF_API + '/logout';
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.get(url, { headers });
  }
}
