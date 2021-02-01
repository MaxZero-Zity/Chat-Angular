import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
// Component
import { AppComponent } from './app.component';
import { ChatInboxComponent } from './component/chat-inbox/chat-inbox.component';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ProfileComponent } from './component/profile/profile.component';
import { RegisterComponent } from './component/register/register.component';

// Firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { firebaseConfig } from  './config/firebase/firebaeConfig'
import { AuthService } from './services/auth.service';
import { VerifyEmailComponent } from './component/verify-email/verify-email.component';
import { ChatBoxUserComponent } from './component/chat-box-user/chat-box-user.component';








@NgModule({
  declarations: [
    AppComponent,
    ChatInboxComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    ProfileComponent,
    RegisterComponent,
    VerifyEmailComponent,
    ChatBoxUserComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
