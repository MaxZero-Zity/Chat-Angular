import { UserProfile } from './../../shared/services/userProfile-model';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RestApiService } from 'src/app/shared/services/rest-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  imageSrc = '../../../assets/MaxZero-logo.png';
  rooms: any = [];
  email: string;
  userId:Int16Array;
  constructor(
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    public restApi: RestApiService,
    public router: Router,
    ) { }

  ngOnInit(): void {
    this.getUserId();
    // this.getAllRooms();
  }
  getUserId(){
    if(this.authService.isLoggedIn){
      const user = JSON.parse(localStorage.getItem('user'));
      this.email = user.email;
      console.log('email==',this.email);
      this.restApi.getUserProfile(this.email).subscribe((data: UserProfile) => {
          console.log('data==',data.data.name);
          this.userId = data.data.id;
      })
      this.getAllRooms(this.email)
    }else{
      window.alert('กรุณาล็อคอิน')
      this.router.navigate(['/login']);
    }
  }
  getAllRooms(email:string) {
    this.restApi.getAllRoomsChat(email).subscribe((data: {}) => {
      this.rooms = data['data'];
    })
  }
  gotoChatRoom(roomId,friendName,friendId){
    this.router.navigate(['/chat-inbox',roomId,friendName,friendId,this.userId]);
  }
}
