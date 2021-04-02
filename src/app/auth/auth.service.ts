import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../shared/alertDialog/AlertDialog.component';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;

  private isAuthenticated = false;

  private tokenTimer: any;

  private userId: string;

  private authStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  //SERVICE QUI VA AFFICHER MA DIALOG BOX AVEC LE MESSAGE DE MON CHOIX
  alertBox(data) {
    this.dialog.open(AlertDialogComponent, {
      data: {
        message: data,
        buttonText: {
          cancel: 'Ok',
        },
      },
    });
  }

  //CREATION D'UN USER OU ADMIN
  //VOIR COMMNET MODIFIER SI ADMIN
  createUser(username: string, email: string, password: string, role: string) {
    const authData: AuthData = {
      username: username,
      email: email,
      password: password,
      role: role,
    };

    const roleEndPoint =
      role === 'admin' ? 'registrer-admin' : 'registrer-user';

    this.http.post(BACKEND_URL + roleEndPoint, authData).subscribe(
      (response) => {
        this.alertBox(response);
        console.log(response);

        this.router.navigate(['/login']);
      },
      (error) => {
        this.alertBox(error.error.message);

        // this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    let user = {
      email,
      password,
    };

    this.http
      .post<{
        user_id: string;
        username: string;
        role: string;
        email: string;
        token: string;
        expiresIn: number;
      }>(BACKEND_URL + 'login', user)
      .subscribe(
        (response) => {
          this.alertBox(JSON.stringify(response));
          const token = response.token;
          this.token = token;
          if (token) {
            //durée d'expiration
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            console.log('EXPIRATION IN DURATION:', expiresInDuration);

            this.isAuthenticated = true;
            this.userId = response.user_id;
            console.log('USERID:', this.userId);


            // this.authStatusListener.next(true);

            const now = new Date();
            console.log('DATE NOW', now);

            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );

            console.log('EXPIRATION DATE:', expirationDate);

            this.saveAuthData(token, expirationDate, this.userId);

            if(response.role === 'admin') {
              console.log('ROLE:', response.role)
              this.router.navigate(["/admin-dashboard"]);
            }
            this.router.navigate(["/login-dashboard"]);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  //FONCTION DEFINIR UN TIMER POUR LE TOKEN
  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}
