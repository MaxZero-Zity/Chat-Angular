import { Component, OnInit } from '@angular/core';
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

  constructor(
    public authService: AuthService,
    public restApi: RestApiService,
    public router: Router,
    ) { }

  ngOnInit(): void {
    this.getAllRooms();
  }
  getAllRooms() {
    return this.restApi.getAllRoomsChat().subscribe((data: {}) => {
      this.rooms = data['data'];
    })
  }
  gotoChatRoom(roomId){
    this.router.navigate(['/chat-inbox',roomId]);
  }
}
