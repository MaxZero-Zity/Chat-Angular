import { Component } from '@angular/core';
import { HelloServiceService } from './hello-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  name:string;
  helloService:HelloServiceService;
  lstBook = [
    {
      'name': 'test1',
    },
    {
      'name': 'test2'
    },
    {
      'name': 'test3'
    }
  ];
  constructor(private helloSw: HelloServiceService){
    this.helloService = helloSw;
  }

  setName(name){
    this.name = name;
    this.helloSw.hello();
  }
}
