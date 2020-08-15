import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;

}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private router: Router) {

    }
    tokenExpirationTimer: any;
    user = new BehaviorSubject<User>(null); // behaviour subject we subscribe to a previous value
    toke: string;
    signUp(email: string , password: string) {
       return this.http.post<AuthResponseData>
       ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC-ikP-LHXVzdbQ3WpxnXX9e7P-N0DgJaU',
        {
            email : email,
            password: password,
            returnSecureToken: true

        }).pipe( catchError (this.handleError), tap (resposne => {
            return this.handleAuthentication(resposne.email, resposne.localId , resposne.idToken , +resposne.expiresIn);
        }));
    }

    login(email: string , password: string) {

       return this.http.post<AuthResponseData>
        ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC-ikP-LHXVzdbQ3WpxnXX9e7P-N0DgJaU',
        {
            email : email,
            password: password,
            returnSecureToken: true
        }).pipe( catchError (this.handleError), tap (response => {
            return this.handleAuthentication(response.email, response.localId , response.idToken , +response.expiresIn);
        }));
    }

    private handleError (errorResp: HttpErrorResponse) {
        let errorMessage = 'An unknown Error occured';
            if (!errorResp.error || !errorResp.error.error) {
             return throwError(errorMessage);
            }
            switch (errorResp.error.error.message) {
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
                 break;
                case 'EMAIL_EXISTS':
                    errorMessage = 'The email address is already in use by another account.';
                 break;
                 case 'INVALID_PASSWORD':
                    errorMessage = 'The password is invalid or the user does not have a password.';
                 break;
            }
            return throwError(errorMessage);
    }
    private handleAuthentication(
        email: string,
        userId: string,
        token: string,
        expiresIn: number
    ) {
        const expiratinDate = new Date(new Date().getTime() + +expiresIn * 1000);
        const newUser = new User(
                 email,
                 userId,
                 token,
                 expiratinDate);
        this.user.next(newUser);
       localStorage.setItem('userData', JSON.stringify(newUser));
       this.autoLogout(expiresIn * 1000);

    }

    logout() {
      this.user.next(null);
      this.router.navigate(['/auth']);
      localStorage.removeItem('userData');
      if (this.tokenExpirationTimer) {
          clearTimeout(this.tokenExpirationTimer);
      }
    }
    autoLogin() {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } =  JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return;
      }
      const loadedUser = new User(
                        userData.email,
                        userData.id,
                        userData._token,
                        new Date(userData._tokenExpirationDate)
        );
        if (loadedUser.token) {
         this.user.next(loadedUser);
         const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
         this.autoLogout(expirationDuration);
        }
    }
    autoLogout(expirationDuration: number) {

       this.tokenExpirationTimer =   setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }
}
