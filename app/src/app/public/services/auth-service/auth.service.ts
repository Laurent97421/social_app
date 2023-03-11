import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginResponseInterface } from 'src/app/model/login-response.interface';
import { UserInterface } from 'src/app/model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }

  login(user: UserInterface): Observable<LoginResponseInterface> {
    return this.http.post<LoginResponseInterface>('/api/users/login', user).pipe(
      tap((res: LoginResponseInterface) => localStorage.setItem('acces_token', res.access_token)),
      tap(() => this.snackbar.open(`Login successfull`, 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      }))
    );
  }


}
