import { Component , OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  // template: `
  // <app-server></app-server>
  // <app-server></app-server>
  // `,
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  allowNewServer = false;
  allowEditUserName = false;
  serverCreateStatus = 'No server was created!';
  serverName = "";
  userName = '';
  statusCreate = false;
  servers = ['TestServer','TestServer 2'];
  constructor() {
    setTimeout(()=>{
      this.allowNewServer = true;
    },2000);
  }

  ngOnInit(): void {
  }

  onCreateServer(){
    this.statusCreate = true;
    this.servers.push(this.serverName);
    this.serverCreateStatus = 'Server was created!' +' '+ this.serverName;
    // setTimeout(()=>{
    //   this.serverCreateStatus =' No server was created!';
    // },2000);
  }
  onUpdateServerName(event:Event){
    this.serverName = (<HTMLInputElement>event.target).value;
  }

  onUpdateUserName(event:Event){
    console.log((<HTMLInputElement>event.target).value)
    if((<HTMLInputElement>event.target).value != ''){
      this.allowEditUserName = true;
    }else{
      this.allowEditUserName = false;
    }
  }

}
