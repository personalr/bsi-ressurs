import { Lister } from './services/lister';
// import { Router } from '@angular/router';

import { AuthService } from './signin/auth.service';
import { Component, OnInit } from '@angular/core';
import {
  Routes,
  RouterModule,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, 
    private router: Router,
    private actRoute: ActivatedRoute,
    private lister: Lister,
    private url: LocationStrategy
  ) { }


  ngOnInit() {
    localStorage.clear();
    if (!this.authService.isAuthenticated()) {
      if (this.url.path().indexOf('/verify') > -1) {
      }else{
        this.router.navigate(['/signin']);
      }
    }
  }
}
