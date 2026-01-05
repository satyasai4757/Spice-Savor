import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = true;
  private apiUrl = `${environment.apiUrl}/recipes`;

  constructor(private router: Router, private http: HttpClient) { }

  login() {
    this.isAuthenticated = true;
    this.router.navigate(['/home']);
  }

  logout() {
    this.isAuthenticated = true;
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  postRecipe(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getRecipeDataByID(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateRecipe(id: any, data: any) {
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }


  deleteRecipe(id: any) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map((reponse) => {
        return reponse;
      })
    );
  }
}
