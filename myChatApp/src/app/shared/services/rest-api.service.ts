import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../services/user-backend';
import { Rooms } from '../services/room-model';
import { Messages } from '../services/message-model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class RestApiService {

  // Define API
  apiURL = environment.API_URL;
  constructor(private http: HttpClient) { }


   // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  createUser(user): Observable<User> {
    return this.http.post<User>(this.apiURL + '/user/create', JSON.stringify(user), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  getAllRoomsChat(email:string):Observable<Rooms>{
    return this.http.get<Rooms>(this.apiURL + '/rooms/all/'+email)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  addMessage(message):Observable<Messages>{
    return this.http.post<Messages>(this.apiURL + '/message/add', JSON.stringify(message), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getMessageByRoom(roomId):Observable<Messages>{
    return this.http.get<Messages>(this.apiURL + '/message/all/'+roomId)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }



    // Error handling
    handleError(error) {
      let errorMessage = '';
      if(error.error instanceof ErrorEvent) {
        // Get client-side error
        errorMessage = error.error.message;
      } else {
        // Get server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      window.alert(errorMessage);
      return throwError(errorMessage);
   }

}
