import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelloServiceService {

  constructor() { }


  hello(){
    console.log('log from service!')
  }

}
