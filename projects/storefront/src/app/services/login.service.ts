import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  PATH_OF_API = 'http://127.0.0.1:8000/api';
  constructor(private http: HttpClient) {}
  
  public login(data: any) {
    return this.http.post(this.PATH_OF_API + '/login', data);
  }
}
