import { NgModule, Component } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { Routes } from '@angular/router';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { AuthComponent } from './auth/auth.component';

const appRoutes: Routes = [
{path: '' , redirectTo: '/recipes', pathMatch: 'full'},
{path : 'auth' , component: AuthComponent},
{path: 'recipes' , loadChildren: './recipes/recipes.module#RecipesModule' },
{path: 'shopping-list' , loadChildren: './shopping-list/shopping-list.module#ShoppingListModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules})],
   exports: [RouterModule]
})
export class AppRoutingModule {

}
