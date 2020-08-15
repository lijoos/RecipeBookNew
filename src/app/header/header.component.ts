import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { DataStorageServie } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent  implements OnInit, OnDestroy {
 constructor(private dataStorageService: DataStorageServie , private authService: AuthService) {
 }
 isAuthenticatd = false;
 private userSub: Subscription ;
  ngOnInit(): void {
   this.userSub =  this.authService.user.subscribe(user => {
       this.isAuthenticatd = !!user;
   });
  }

 saveData() {
this.dataStorageService.storeRecipe();
 }
 fetchData() {
  this.dataStorageService.fetchRecipe().subscribe();
 }

 ngOnDestroy(): void {
 this.userSub.unsubscribe();
}
 onlogout() {
this.authService.logout();
}
}
