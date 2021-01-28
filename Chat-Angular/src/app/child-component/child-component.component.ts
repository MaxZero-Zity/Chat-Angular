import { Component, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-child-component',
  templateUrl: './child-component.component.html',
  styleUrls: ['./child-component.component.scss']
})
export class ChildComponentComponent implements OnInit {

  constructor() { }
  @Output() inputValueFromChild: EventEmitter<string> = new EventEmitter<string>();
  ngOnInit(): void {
  }

  emitValue(value){
    console.log(value);
    this.inputValueFromChild.emit(value);
  }

}
