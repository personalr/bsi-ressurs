import { AuthService } from './../signin/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Lister } from './../services/lister';




@Component({
  selector: 'app-reset-passord',
  templateUrl: './reset-passord.component.html',
  styleUrls: ['./reset-passord.component.css']
})
export class ResetPassordComponent implements OnInit {

  constructor(private router: Router,
    private authService: AuthService, private lister: Lister,  private http: Http ) { }

    ngOnInit() {
    }
    onSignin(form: NgForm) {
      const password = form.value.password;
      const password_r = form.value.password_r;

      this.setNyttPassord(password).subscribe(
        resp => {
            this.router.navigate(['home']);
        });

    }


    setNyttPassord(password) {
      const postData = {
        passord: password,
      };
      return this.http.put(this.lister.reqstring + '/endrer_passord', postData, this.authService.getOpts())
        .map(response => {
          console.log(response);
          return response.json();
        }).catch(
        (error: Response) => {
          console.log(error);
       //   return '';
          return Observable.throw(error.json());
        }
        );
    }

}
