import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';
const CONST_USERNAME = 'username';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any, username: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    window.sessionStorage.setItem(CONST_USERNAME, JSON.stringify(username));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    const username = window.sessionStorage.getItem(CONST_USERNAME);
    if (user && username) {
      return [JSON.parse(username), JSON.parse(user)];
    }
    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }
    return false;
  }
}