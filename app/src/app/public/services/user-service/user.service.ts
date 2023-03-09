import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { UserInterface } from 'src/app/model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }

  create(user: UserInterface): Observable<UserInterface> {
    return this.http.post<UserInterface>('/api/users', user).pipe(
    // return this.http.post<UserInterface>('http://localhost:3000/api/users', user).pipe(
      tap((createdUser: UserInterface) => this.snackbar.open(`User ${createdUser.username} created successfully`, 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      })),
      catchError(e => {
        this.snackbar.open(`User could not be created, due to: ${e.error.message}`, 'Close', {
          duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
        })
        return throwError(e);
      })
    );
  }

}
