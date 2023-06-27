import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor() { }
  public setRoles(roles: []) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  public getRoles(): [] {
    return JSON.parse(localStorage.getItem('roles') as any);
  }
  public setToken(auth_token: string) {
    localStorage.setItem('auth_token', auth_token);
  }

  public getToken(): string {
    return localStorage.getItem('auth_token') as any;
  }
  public clear() {
    localStorage.clear();
  }

  public removeToken() {
    localStorage.removeItem('auth_token');
  }
  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }

  public isAdmin() {
    const roles: any[] = this.getRoles();
    return roles[0].roleName === 'Admin';
  }

  public isUser() {
    const roles: any[] = this.getRoles();
    return roles[0].roleName === 'User';
  }
}
