import { NgModule } from '@angular/core';
import { ShoppingListRoutingModule } from './shopping-list.routes';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';
import { CommonModule } from '@angular/common';
import {  FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations:
    [ShoppingListComponent,
    ShoppingEditComponent],
    imports: [ShoppingListRoutingModule,
             FormsModule,
             SharedModule]
})
export class ShoppingListModule {

}
