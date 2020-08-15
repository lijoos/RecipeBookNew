import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { PlaceHolderDirective } from './placeHolder/placeHolder.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { DropdownDirective } from './dropdown.directive';

@NgModule({
    declarations:
    [
     AlertComponent,
     PlaceHolderDirective,
     LoadingSpinnerComponent,
     DropdownDirective,

    ],
    imports: [CommonModule],
    exports: [
     AlertComponent,
     PlaceHolderDirective,
     LoadingSpinnerComponent,
     CommonModule,
     DropdownDirective,
    ]
})
export class SharedModule {

}
