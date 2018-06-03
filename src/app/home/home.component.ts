import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Lister } from './../services/lister';
import { AuthService } from './../signin/auth.service';
import { DataStorageService } from './../services/data-storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: []
})
export class HomeComponent implements OnInit {
  username: String;
  repoContents: Array<Object> = [];

  constructor(private router: Router,
    private ds: DataStorageService,
    private authService: AuthService, private lister: Lister, private http: Http ) { }

  ngOnInit() {
    /*
    this.authService.getToken();
    this.getChangePw().subscribe(
      resp => {
        const maaSkiftePw = Number(JSON.stringify(resp.data));
        const  talle: any = resp.data;
        if (resp.data === '0') {
          this.router.navigate(['reset_passord']);
        }
      });
      */
  }


  getChangePw() {
    return this.http.get(this.lister.reqstring + '/changepw', this.authService.getOpts())
      .map(response => {
        return response.json();
      }).catch(
      (error: Response) => {
        console.log(error);
        return Observable.throw(error.json());
      }
      );
  }

}
