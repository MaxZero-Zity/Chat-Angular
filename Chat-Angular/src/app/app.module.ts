import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HeroesComponent } from './heroes/heroes.component';
import { ChildComponentComponent } from './child-component/child-component.component';
import { HelloServiceService } from './hello-service.service';



@NgModule({
  declarations: [
    HeroesComponent,
    ChildComponentComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [HelloServiceService],
  bootstrap: [HeroesComponent]
})
export class AppModule { }
