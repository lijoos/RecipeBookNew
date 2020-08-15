import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeHolder/placeHolder.directive';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
    constructor(private authServie: AuthService ,
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver) {
    }
    @ViewChild(PlaceHolderDirective , {static: false}) alertHost: PlaceHolderDirective;
    isLoginMode = true;
    isLoading = false;
    errorMessage: string;
    private closeSub: Subscription;
    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }
    onSubmit(form: NgForm) {
        console.log(form);
        if (!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;
        let authObservable: Observable<AuthResponseData>;
        this.isLoading = true;
        if (this.isLoginMode) {
            authObservable = this.authServie.login(email, password);
        } else {
            authObservable =  this.authServie.signUp(email, password);
        }
        authObservable.subscribe(
            Response => {
                  console.log(Response);
                  this.isLoading = false;
                  this.router.navigate(['/recipes']);
            },
            errorMessage => {
              this.isLoading = false;
              this.errorMessage = errorMessage;
              this.showErrorAlert(errorMessage);
           });

        form.reset();
    }
    onHandleError() {
        this.errorMessage = null;
    }
    showErrorAlert(errorMessage: string) {
     // dynamica creation of alert component
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
   const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);
   componentRef.instance.message  = errorMessage;
    this.closeSub = componentRef.instance.close.subscribe(() => {
        this.closeSub.unsubscribe();
        hostViewContainerRef.clear();
    });
    }

    ngOnDestroy(): void {
        if (this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }
}
