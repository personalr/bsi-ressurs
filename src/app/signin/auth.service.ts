import { Lister } from './../services/lister';

import { Router } from '@angular/router';
import { Injectable } from '@angular/core';


import { Headers, Response, RequestOptions, Http, ResponseContentType } from '@angular/http';
// import { Observable } from 'rxjs/Observable'; // når man bruker map -metode
// import 'rxjs/add/operator/map';

// tslint:disable-next-line:import-blacklist
//import { Observable } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';//
// import 'rxjs/add/operator/timer';
import 'rxjs/add/observable/timer';

@Injectable()
export class AuthService {
  token: string;

  timer = Observable.timer(0, 600000); // 10 minutter


  constructor(private router: Router, private http: Http, private lister: Lister) {

    this.timer.subscribe(tick => {

     const diff = new Date().getTime() - (+localStorage.getItem('ts'));


 //  console.log(diff);
    if (diff > (-600000) ) {

      return this.refreshToken()
      .subscribe(
      response => {
      }
      ,
      (error) => {
        console.log(error);
      }
      );


    }




   });

}


signinUser(email: string, password: string) {
  return this.signInWithEmailAndPassword(email, password)
    .subscribe(
    response => {
      this.getRollene().subscribe(
        resp => {
          for (let i = 0; i < resp.data.length; i++) {
            localStorage.setItem(resp.data[i], '');
          }
          this.router.navigate(['./home']);
        });
    }
    ,
    (error) => console.log(error)
    );
}







logout() {
  // husk  å sette passord og email til null

  localStorage.removeItem('t');
  localStorage.removeItem('ts');
  localStorage.removeItem('admin');

  localStorage.clear();

  this.token = null;
  this.router.navigate(['/']);

}


refreshToken() {


  const postData = {
    refresh_token: localStorage.getItem('rt'),
  };


  return this.http.post(this.lister.reqstring + 'oauth/refresh', postData, { headers: this.headers }).map(
    response => {
      const expDate = new Date();
      expDate.setSeconds(expDate.getSeconds() + response.json().expires_in);
      localStorage.setItem('t', response.json().access_token);
      localStorage.setItem('rt', response.json().refresh_token);
      this.token = response.json().access_token;

      localStorage.setItem('ts', '' + expDate.getTime());
  
      return response.json().access_token;
    }).catch(
    (error: Response) => {
      return Observable.throw('Something went wrong');
    });

}

// tslint:disable-next-line:member-ordering
isAuthenticated() {
  return this.token != null;
}

  // tslint:disable-next-line:member-ordering
  private headers = new Headers(); // headers for each request
  // tslint:disable-next-line:member-ordering
  private options = new RequestOptions({ headers: this.headers });
  // tslint:disable-next-line:member-ordering
  private errorMessage;


getRollene() {
  // console.log('getRollene');
  return this.http.get(this.lister.reqstring + '/rollene', this.getOpts())
    .map(response => {
   //   console.log(response);

      return response.json();
    }).catch(
    (error: Response) => {
      return Observable.throw(error.json());
    }
    );
}



signInWithEmailAndPassword(email, pasword) {
  const postData = {
    //  username: 'zemlak.sandra@example.net', // a User in Laravel database
    username: email,

    // username: 'eldon33@example.com',
    password: pasword, // 'secret' // the user's password
  };
  // return this.http.post('http://rig.rj-web.no/public/oauth/token', postData, { headers: this.headers }).map(

  return this.http.post(this.lister.reqstring + 'oauth/token', postData, { headers: this.headers }).map(

    response => {
      const expDate = new Date();
      expDate.setSeconds(expDate.getSeconds() + response.json().expires_in);
      localStorage.setItem('t', response.json().access_token);
      localStorage.setItem('rt', response.json().refresh_token);

      this.token = response.json().access_token;
      localStorage.setItem('ts', '' + expDate.getTime());
      return response.json().access_token;
    }).catch(
    (error: Response) => {
      return Observable.throw('Something went wrong');
    });

}


// tslint:disable-next-line:member-ordering

getOpts() {

  return new RequestOptions({
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    })
  });

}
/*
getBlobOpts() {

const head = new Headers({
  'Accept': 'application/json',
  'Authorization': 'Bearer ' + this.getToken(),
});

const test =  new RequestOptions({
  headers: head,
  responseType: ResponseContentType.Blob
});

return test;

}
*/

getToken() {
    return this.token;
}


}


