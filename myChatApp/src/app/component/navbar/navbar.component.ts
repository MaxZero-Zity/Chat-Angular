import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RestApiService } from 'src/app/shared/services/rest-api.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    public restApi: RestApiService,
    public router: Router,
    ) { }

  ngOnInit(): void {
  }


  logOut(){
    Swal.fire({
      title: 'ออกจากระบบใช่หรือไม่...?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logOut()
      }
    })

  }

}
