import { AuthService } from './../signin/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verneutsyr',
  templateUrl: './verneutsyr.component.html',
  styleUrls: ['./verneutsyr.component.css']
})
export class VerneutsyrComponent implements OnInit {

  constructor(   private authService: AuthService,) { }

  ngOnInit() {
  this.authService.getToken();
  }

}
