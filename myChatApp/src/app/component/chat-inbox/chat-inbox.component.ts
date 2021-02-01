import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { ActivatedRoute } from '@angular/router';
const SOCKET_ENDPOINT ='localhost:3000';
@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrls: ['./chat-inbox.component.css']
})
export class ChatInboxComponent implements OnInit {
  socket;
  message: string;
  constructor(private activatedRoute:ActivatedRoute) { }
  roomId;
  ngOnInit(): void {
    this.setupSocketConnection();
  }
  setupSocketConnection(){
    this.roomId = this.activatedRoute.snapshot.paramMap.get("id");
    // console.log('roomId ==',this.roomId);
    this.socket = io(SOCKET_ENDPOINT,{ query: "roomId="+this.roomId });
    // console.log(this.socket.)
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
