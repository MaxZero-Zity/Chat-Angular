import { Messages } from './../../shared/services/message-model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RestApiService } from 'src/app/shared/services/rest-api.service';
import { environment } from 'src/environments/environment';
import { faComment } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrls: ['./chat-inbox.component.css']
})

export class ChatInboxComponent implements OnInit {
  socket;
  message: string;
  faComment = faComment;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  constructor(
    private activatedRoute:ActivatedRoute,
    public authService: AuthService,
    public restApi: RestApiService,
    public router: Router,
  ) { }
  roomId;
  friendName:string;
  friendId:string;
  userId:string;
  dataMessage: any[] = [];
  ngOnInit(): void {
    this.setupSocketConnection();
    this.scrollToBottom();
  }
    ngAfterViewChecked() {
      this.scrollToBottom();
  }

  scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }
  }


  setupSocketConnection(){
    this.roomId = this.activatedRoute.snapshot.paramMap.get("id");
    this.friendName = this.activatedRoute.snapshot.paramMap.get("name");
    this.friendId = this.activatedRoute.snapshot.paramMap.get("friendId");
    this.userId = this.activatedRoute.snapshot.paramMap.get("userId");
    this.socket = io(environment.SOCKET_ENDPOINT,{ query: "roomId="+this.roomId });


    this.restApi.getMessageByRoom(this.roomId).subscribe((data: {}) => {
        this.dataMessage = data['data']
        // console.log(this.dataMessage);
    })

    this.socket.on('message-broadcast', (data: string) => {
      console.log('message-broadcast',data)
    if (data) {
    this.restApi.getMessageLastByRoom(this.roomId).subscribe((data: {}) => {
        var getData = data['data'];
        this.dataMessage.push(getData);
    })
    //  const element = document.createElement('li');
    //  element.innerHTML = data;
    //  element.style.background = 'white';
    //  element.style.padding =  '15px 30px';
    //  element.style.margin = '10px';
    //  document.getElementById('message-list').appendChild(element);
     }
   });
  }
  sendMessage(){
    this.socket.emit('room'+this.roomId, this.message);
    this.restApi.addMessage({text:this.message,room_id:parseInt(this.roomId),user_id:parseInt(this.userId)}).subscribe((data: {}) => {
      var getData = data['data'];
      this.dataMessage.push(getData);
    })

    // const element = document.createElement('li');
    // element.innerHTML = this.message;
    // element.style.background = 'white';
    // element.style.padding =  '15px 30px';
    // element.style.margin = '10px';
    // element.style.textAlign = 'right';
    // document.getElementById('message-list').appendChild(element);
    this.message = '';
  }

}
