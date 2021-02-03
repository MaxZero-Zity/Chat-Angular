import { UserProfile } from './../../shared/services/userProfile-model';
import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { io } from 'socket.io-client';
import { from } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RestApiService } from 'src/app/shared/services/rest-api.service';
import { environment } from 'src/environments/environment';
import { faComment,faPlus,faSmile } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
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
  faSmile = faSmile;
  statusSelectRoom = false;
  addEmailFriend:string;
  toggled: boolean = true;

  constructor(
    private activatedRoute:ActivatedRoute,
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    public restApi: RestApiService,
    public router: Router,
    ) { }

  ngOnInit(): void {
    Swal.fire({
      title: 'Loading...',
      didOpen: () => {
        Swal.showLoading()
      },
    });
    this.getUserId();
  }
  getUserId(){
    if(this.authService.isLoggedIn){
      const user = JSON.parse(localStorage.getItem('user'));
      this.email = user.email;
      this.restApi.getUserProfile(this.email).subscribe((data: UserProfile) => {
          this.userId = data.data.id;
          this.getAllRooms()
      })
    }else{
      Swal.close()
      setTimeout(()=>{
        Swal.fire({
          icon: 'error',
          title: 'กรุณาล็อคอิน',
          confirmButtonText: 'OK',
        }).then((result)=>{
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          }
        })
       }, 10);
    }
  }
  getAllRooms() {
    this.restApi.getAllRoomsChat(this.userId).subscribe((data: {}) => {
      this.rooms = data['data'];
      Swal.close();
    })
  }
  selectChatRoom(roomId:Int16Array,friendName:string,friendId:Int16Array){
        Swal.fire({
          title: 'Loading...',
          didOpen: () => {
            Swal.showLoading()
          },
        });
        this.statusSelectRoom = true;
        this.roomId = roomId;
        this.friendName = friendName;
        this.friendId = friendId;
        this.setupSocketConnection();
  }

  setupSocketConnection(){
    this.socket = io(environment.SOCKET_ENDPOINT,{ query: "roomId="+this.roomId });
    this.restApi.getMessageByRoom(this.roomId).subscribe((data: {}) => {
        this.dataMessage = data['data']
    })
    this.socket.on('message-broadcast', (data: string) => {
    if (data) {
        this.restApi.getMessageLastByRoom(this.roomId).subscribe((data: {}) => {
            this.dataMessage.push(data['data']);
        })

     }

   });
   setTimeout(()=>{
    this.scrollToBottom();
   }, 30);

   Swal.close();
  }

  async sendMessage(){
    await this.restApi.addMessage({text:this.message,room_id:this.roomId,user_id:this.userId}).subscribe((data: {}) => {
      this.dataMessage.push( data['data']);
      this.socket.emit('room'+this.roomId, this.message);
      this.message = '';
    })
  }

  addFriend(){
      Swal.fire({
        title: 'Loading...',
        didOpen: () => {
          Swal.showLoading()
        },
      });
      this.restApi.addRoom(this.addEmailFriend,this.userId).subscribe((data: {}) => {
        Swal.close()
        setTimeout(()=>{
          Swal.fire('เพิ่มเพื่อนสำเร็จ').then((result)=>{
            this.refresh();
          });
         }, 10);
        this.addEmailFriend = '';
      })
  }
  refresh(): void {
    window.location.reload();
  }
  handleSelection(event) {
    console.log(event.char);
    this.message += event.char;
  }
  scrollToBottom(): void {
    console.log('55555')
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

}
