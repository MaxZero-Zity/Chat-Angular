import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Component
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ProfileComponent } from './component/profile/profile.component';
import { RegisterComponent } from './component/register/register.component';
import { VerifyEmailComponent } from './component/verify-email/verify-email.component';
import { ChatInboxComponent } from './component/chat-inbox/chat-inbox.component';
// Service
import { AuthService } from './services/auth.service';

// Guard
import { AuthGuard } from './guards/auth.guard';


// Routes
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent,canActivate: [AuthGuard] },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: 'chat-inbox/:id/:name/:friendId/:userId', component: ChatInboxComponent ,canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
