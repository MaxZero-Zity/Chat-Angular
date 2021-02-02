import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RestApiService } from 'src/app/shared/services/rest-api.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrls: ['./chat-inbox.component.css']
})
export class ChatInboxComponent implements OnInit {
  socket;
  message: string;
  constructor(
    private activatedRoute:ActivatedRoute,
    public authService: AuthService,
    public restApi: RestApiService,
    public router: Router,
  ) { }
  roomId;
  ngOnInit(): void {
    this.setupSocketConnection();
  }



  setupSocketConnection(){
    this.roomId = this.activatedRoute.snapshot.paramMap.get("id");
    // console.log('roomId ==',this.roomId);
    this.socket = io(environment.SOCKET_ENDPOINT,{ query: "roomId="+this.roomId });
    // console.log(this.socket.)

    this.restApi.getMessageByRoom(this.roomId).subscribe((data: {}) => {
        console.log('data ==',data)
        for (var item of data['data']) {
          console.log(item['text']);
          const element = document.createElement('li');
          element.innerHTML = item['text'] ? item['text']:'';
          element.style.background = 'white';
          element.style.padding =  '15px 30px';
          element.style.margin = '10px';
          element.style.textAlign = 'right';
          document.getElementById('message-list').appendChild(element);
        }

    })

    this.socket.on('message-broadcast', (data: string) => {
      console.log('message-broadcast',data)
    if (data) {
     const element = document.createElement('li');
     element.innerHTML = data;
     element.style.background = 'white';
     element.style.padding =  '15px 30px';
     element.style.margin = '10px';
     document.getElementById('message-list').appendChild(element);
     }
   });
  }
  SendMessage(){
    this.socket.emit('room'+this.roomId, this.message);
    this.restApi.addMessage({text:this.message,room_id:parseInt(this.roomId),user_id:1}).subscribe((data: {}) => {
      console.log('บันทึกสำเร็จ')
    })
    const element = document.createElement('li');
    element.innerHTML = this.message;
    element.style.background = 'white';
    element.style.padding =  '15px 30px';
    element.style.margin = '10px';
    element.style.textAlign = 'right';
    document.getElementById('message-list').appendChild(element);
    this.message = '';
  }
}
