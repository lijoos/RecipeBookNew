import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { inject } from '@angular/core/testing';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService,   @Inject(PLATFORM_ID) private platformId) {
  }
  ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    this.authService.autoLogin();
  }
  }
}
