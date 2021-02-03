import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { User } from '../services/user-backend';
import { Rooms } from '../services/room-model';
import { Messages } from '../services/message-model';
import { UserProfile } from '../services/userProfile-model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AddRoom } from './addRoom-model';
import Swal from 'sweetalert2'
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
  //User
  createUser(user): Observable<User> {
    return this.http.post<User>(this.apiURL + '/user/create', JSON.stringify(user), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  getUserProfile(email:string):Observable<UserProfile>{
    return this.http.post<UserProfile>(this.apiURL + '/user/get/profile', JSON.stringify({email:email}), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  //Room
  getAllRoomsChat(id:Int16Array):Observable<Rooms>{
    return this.http.post<Rooms>(this.apiURL + '/rooms/all', JSON.stringify({id:id}), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  addRoom(email:string,user_id:Int16Array):Observable<AddRoom>{
    return this.http.post<AddRoom>(this.apiURL + '/rooms/add', JSON.stringify({email:email,userId:user_id}), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  //Message
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
  getMessageLastByRoom(roomId):Observable<Messages>{
    return this.http.get<Messages>(this.apiURL + '/message/last/'+roomId)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }



    // Error handling
    handleError(error) {

      let errorMessage = '';
      if(error.error instanceof HttpErrorResponse) {
        // Get client-side error
        errorMessage = error.message;
      } else {
        // Get server-side error
        var getStatus = error.error.statusCode ? error.error.statusCode : '' ;
        var getMessage = error.error.message;
        errorMessage = `Error Code: ${getStatus}\nMessage: ${getMessage}`;
      }
      Swal.fire(errorMessage)
      return throwError(errorMessage);
   }

}
