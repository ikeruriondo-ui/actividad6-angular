import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private baseUrl = 'https://peticiones.online/api/users';

  getUsers() {
    return this.http.get<any>(this.baseUrl);
  }

  getUserById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createUser(user: {
    first_name: string;
    last_name: string;
    email: string;
    image: string;
  }) {
    return this.http.post<any>(this.baseUrl, user);
  }

  updateUser(id: string, user: {
    first_name: string;
    last_name: string;
    email: string;
    image: string;
  }) {
    return this.http.put<any>(`${this.baseUrl}/${id}`, user);
  }

  deleteUser(id: string) {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
