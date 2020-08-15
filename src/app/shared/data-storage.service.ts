import { inject } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map, tap, exhaustMap, take } from 'rxjs/operators';
import { Ingredient } from './ingredient.model';
import { AuthService } from '../auth/auth.service';
@Injectable({
    providedIn: 'root'
}
)
export class DataStorageServie {
    fetchRecipe() {
       return this.http.get<Recipe[]>
                    ('https://angular-recipe-book-ed73a.firebaseio.com/recipes.json')
                    .pipe(
                     map(recipes => {
                    return recipes.map(recipe => {
                        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                    });
                }),
                tap(recipes => {
                    this.recipeService.setRecipes(recipes);
                }));
    }
    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {
    }
    storeRecipe() {
        const recipes = this.recipeService.getRecipes();
        return this.http.put('https://angular-recipe-book-ed73a.firebaseio.com/recipes.json', recipes).subscribe((response) => {
        });

    }
}
