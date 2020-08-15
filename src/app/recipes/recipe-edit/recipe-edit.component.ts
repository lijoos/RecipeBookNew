import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForOf } from '@angular/common';
import { NgForm, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  recipe: Recipe;
  constructor(private route: ActivatedRoute , private slService: ShoppingListService ,
     private router: Router, private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] !== undefined;
      this.initForm();
    });
  }
  initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);
    if (this.editMode )  {
       this.recipe = this.recipeService.getRecipe(this.id);
       recipeDescription = this.recipe.description;
       recipeImagePath =  this.recipe.imagePath;
       recipeName = this.recipe.name;
       if (this.recipe['ingredients']) {
         for (const ingredient of this.recipe.ingredients) {
            recipeIngredients.push( new FormGroup({
              'name' : new FormControl(ingredient.name , Validators.required),
              'amount': new FormControl(
                ingredient.amount,
               [ Validators.required, Validators.pattern('^[1-9]+[0-9]*$')]
                )
            }));
         }
       }
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName , Validators.required),
      'description': new FormControl(recipeDescription , Validators.required),
      'imagePath': new FormControl(recipeImagePath , Validators.required),
      'ingredients': recipeIngredients

    });
  }
  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }
  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [ Validators.required, Validators.pattern('^[1-9]+[0-9]*$')])
    }));
  }
  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
  onRecipeEditCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  onSubmit() {
    if (this.editMode) {
      const newRecipe = new Recipe(
        this.recipeForm.value['name'],
        this.recipeForm.value['description'],
        this.recipeForm.value['imagePath'],
        this.recipeForm.value['ingredients'],

      );
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
      this.recipeForm.get('ingredients');
    }
    this.onRecipeEditCancel();
  }

}
