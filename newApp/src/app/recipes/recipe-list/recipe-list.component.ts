import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes:Recipe[] = [
    new Recipe('A Test Recipe','test','https://i.pinimg.com/originals/db/59/c4/db59c4b646a1cf337db155460006396a.jpg'),
    new Recipe('A Test Recipe','test','https://i.pinimg.com/originals/db/59/c4/db59c4b646a1cf337db155460006396a.jpg')
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
