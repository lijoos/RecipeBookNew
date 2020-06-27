import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';

const appRoutes: Routes = [
{path: '' , redirectTo: '/recipes', pathMatch: 'full'},
{path : 'shopping-list' , component: ShoppingListComponent},
{path: 'recipes' , component: RecipesComponent , 
  children: [
       {path: '' , component : RecipeStartComponent},
       {path: 'new' , component : RecipeEditComponent},
       {path: ':id' , component : RecipeDetailComponent},
       {path: ':id/edit' , component : RecipeEditComponent}
]}
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
   exports: [RouterModule]
})
export class AppRoutingModule {

}
