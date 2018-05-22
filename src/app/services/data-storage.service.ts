import { Lister } from './lister';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './../signin/auth.service';
import { Injectable } from '@angular/core';
import { Response, RequestOptions, Http, Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class DataStorageService {
  constructor(private http: Http,
    private authService: AuthService,
    private lister: Lister,
  ) {
  }


  /*
    ROLLENAVN:
        lister.harRolle('brukere') 
        lister.harRolle('verktøy')
        lister.harRolle('brakkerigg')
        lister.harRolle('verneutstyr')
        lister.harRolle('arbeidstøy')
        lister.harRolle('kandidat')
        lister.harRolle('stoffkartotek')
        lister.harRolle('roller')
        public reqstring = 'https://rig.rj-web.no/public/';
  */

  slett(id, objektnavn) {
    const reqString = this.lister.reqstring + objektnavn + '/' + id;
    return this.http.delete(reqString,
      this.authService.getOpts()).map(
        (response: Response) => {
          const data = response.json();
          return data.data;
        }
      ).catch(
        (error: Response) => {
          console.log(error);
         this.feilmelding(error.json(), objektnavn);
          return Observable.throw(error.json());
        }
      );
  }


  ny(obj: any[], objektnavn) {
    if (obj['id']) {
      delete obj['id'];
    }
    return this.http.post(this.lister.reqstring + objektnavn, obj, this.authService.getOpts()).map(
      (response: Response) => {
        const data = response.json();
        return data.data;
      }
    )
      .catch(
        (error: Response) => {
          this.feilmelding(error.json(), objektnavn);
          return Observable.throw(error.json());
        }
      );
  }

  set(obj: any[], objektnavn) {
  // alert(objektnavn);
    return this.http.put(this.lister.reqstring + objektnavn + '/' + obj['id'], obj, this.authService.getOpts()).map(
      (response: Response) => {
        const data = response.json();
        return data.data;
      }
    )
      .catch(
        (error: Response) => {
          this.feilmelding(error.json(), objektnavn);
          return Observable.throw(error.json());
        }
      );
  }

  get(id, objektnavn) {
    console.log('DSS: get()');
    return this.http.get(this.lister.reqstring + objektnavn + '/' + id, this.authService.getOpts())
      .map(response => {
        return response.json().data;
      }).catch(
        (error: Response) => {
          this.feilmelding(error.json(), objektnavn);
          return Observable.throw(error.json());
        }
      );
  }

  getIndex(objektnavn) {
    console.log('DSS: getIndex()');
    return this.http.get(this.lister.reqstring + objektnavn , this.authService.getOpts())
      .map(response => {
        return response.json().data;
      }).catch(
        (error: Response) => {
          this.feilmelding(error.json(), objektnavn);
          return Observable.throw(error.json());
        }
      );
  }


  feilmelding(error, objektnavn) {
    console.log(JSON.stringify(error));
    switch (error.code) {
      case 404: {
        alert(error.error + '- ' + error.code + '-' + objektnavn);
        break;
      }
      case 401: {
        alert('Du har ikke rettigheter til å endre, slette,lagre eller oprette nye ' + objektnavn);
        break;
      }
      default: {
        alert('Uidentifisert feil: ' + error.error + '- ' + error.code);
        break;
      }
    }
  }
}
