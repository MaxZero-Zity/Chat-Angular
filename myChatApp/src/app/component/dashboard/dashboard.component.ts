import { UserProfile } from './../../shared/services/userProfile-model';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { io } from 'socket.io-client';
import { from } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RestApiService } from 'src/app/shared/services/rest-api.service';
import { environment } from 'src/environments/environment';
import { faComment,faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'


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
  roomId:Int16Array;
  friendId:Int16Array;
  friendName:string;
  dataMessage: any[] = [];
  socket;
  message: string;
  faComment = faComment;
  faPlus = faPlus;
  statusSelectRoom = false;

  addEmailFriend:string;

  constructor(
    private activatedRoute:ActivatedRoute,
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
      this.restApi.getUserProfile(this.email).subscribe((data: UserProfile) => {
          // console.log('data==',data.data.name);
          this.userId = data.data.id;
          this.getAllRooms()
      })

    }else{
      window.alert('กรุณาล็อคอิน')
      this.router.navigate(['/login']);
    }
  }
  getAllRooms() {
    this.restApi.getAllRoomsChat(this.userId).subscribe((data: {}) => {
      this.rooms = data['data'];
    })
  }
  // selectChatRoom(roomId:Int16Array,friendName:string,friendId:Int16Array){
  //   this.router.navigate(['/chat-inbox',roomId,friendName,friendId,this.userId]);
  // }
  selectChatRoom(roomId:Int16Array,friendName:string,friendId:Int16Array){
        // console.log('roomId ==',roomId);
        // console.log('friendName ==',friendName);
        // console.log('friendId ==',friendId);
        this.statusSelectRoom = true;
        this.roomId = roomId;
        this.friendName = friendName;
        this.friendId = friendId;
        this.setupSocketConnection();
  }

  setupSocketConnection(){
    // this.roomId = this.activatedRoute.snapshot.paramMap.get("id");
    // this.friendName = this.activatedRoute.snapshot.paramMap.get("name");
    // this.friendId = this.activatedRoute.snapshot.paramMap.get("friendId");
    this.socket = io(environment.SOCKET_ENDPOINT,{ query: "roomId="+this.roomId });
    this.restApi.getMessageByRoom(this.roomId).subscribe((data: {}) => {
        this.dataMessage = data['data']
        // console.log(this.dataMessage);
    })
    this.socket.on('message-broadcast', (data: string) => {
      // console.log('message-broadcast',data)
    if (data) {
        this.restApi.getMessageLastByRoom(this.roomId).subscribe((data: {}) => {
            this.dataMessage.push(data['data']);
        })
     }
   });
  }

  async sendMessage(){
    // console.log(this.message);
    await this.restApi.addMessage({text:this.message,room_id:this.roomId,user_id:this.userId}).subscribe((data: {}) => {
      this.dataMessage.push( data['data']);
      console.log('roomId ==',this.roomId)
      console.log('message ==',this.message)
      this.socket.emit('room'+this.roomId, this.message);
      this.message = '';
    })
  }

  addFriend(){
      console.log('emailFriend =',this.addEmailFriend);
      console.log('userId =',this.userId);
      this.restApi.addRoom(this.addEmailFriend,this.userId).subscribe((data: {}) => {
        console.log('addRoom ==',data);
        Swal.fire('เพิ่มเพื่อนสำเร็จ').then((result)=>{
            this.refresh();
        });
        this.addEmailFriend = '';
      })
  }
  refresh(): void {
    window.location.reload();
  }

}
