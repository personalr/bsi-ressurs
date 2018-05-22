import { ResetPassordComponent } from './../../reset-passord/reset-passord.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource, MatPaginator, MatSort, Sort, MatSortable } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, AbstractControl, FormControl, FormGroupDirective, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from './../../signin/auth.service';
import { Lister } from '../../services/lister';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-innlevering',
  templateUrl: './innlevering.component.html',
  styleUrls: ['./innlevering.component.css']
})
export class InnleveringComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourcePlukk = new MatTableDataSource<any>([]);

  constructor(// private ds: DataStorageService,
    private http: Http,
    private authService: AuthService,
    private lister: Lister
  ) { }


  displayedColumns = ['listenr', 'prosjektnavn', 'prosjekt_id', 'utlevert_til', 'utlevert_av', 'innlevert_til', 'innlevert_av', 'fra_dato', 'til_dato'];
  displayedColumnsPlukk = ['navn', 'ressursnummer', 'verktoygruppe', 'tilgjengelig', 'dato', 'reol', 'hylle', 'plass'];

  dataSource; // = new MatTableDataSource<Element>;//(ELEMENT_DATA);

  ngOnInit() {
  //  console.log('ksajhdksjhdksajhdaksjhsakjdh');
    this.getListe().subscribe(
      (rec: any[]) => {
        this.dataSource = new MatTableDataSource<any>(rec);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }
    );

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.dataSource.sort.sort(<MatSortable>{ id: 'ressursnummer', start: 'desc' });
  }


  konvDato(dato) {
    if (typeof (dato) == 'object' && dato != undefined) {
      let dd = dato.getDate();
      let mm = dato.getMonth() + 1;
      var yyyy = dato.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }

      if (mm < 10) {
        mm = '0' + mm;
      }
      dato = mm + '.' + dd + '.' + yyyy;
      return dato;
    }

    if (!dato) {
      return '';
    }

    if (dato !== '0000-00-00') {
      return dato.substring(8, 10) + '.' + dato.substring(5, 7) + '.' + dato.substring(0, 4);
    } else {
      return '';
    }
  }


  orginalobjekt: any = JSON.parse('{"innlevert_til":""}');
  redigerObjekt: any = JSON.parse('{"innlevert_til":""}');;

  dagerIMellom(dato1, dato2) {
    return Math.floor((Date.UTC(dato2.getFullYear(), dato2.getMonth(), dato2.getDate()) - Date.UTC(dato1.getFullYear(), dato1.getMonth(), dato1.getDate())) / (1000 * 60 * 60 * 24));

  }


  aapneElement(e) {
    let dirty = false;
    for (let propt in this.orginalobjekt) {
      if (propt + ': ' + this.orginalobjekt[propt] != propt + ': ' + this.redigerObjekt[propt]) {
        dirty = true;
      }

      if (propt === 'verktoyutleier') {
        for (let i = 0; i < this.orginalobjekt.verktoyutleier.length; i++) {
          if (this.orginalobjekt.verktoyutleier[i].verktoy.tilgjengelig != this.redigerObjekt.verktoyutleier[i].verktoy.tilgjengelig) {
            dirty = true;
          }
          let dato1 = new Date(this.orginalobjekt.verktoyutleier[i].til_dato);
          let dato2 = new Date(this.redigerObjekt.verktoyutleier[i].til_dato);
          let ingenDato = new Date('1.1.1970');
          if (this.dagerIMellom(dato1, ingenDato) > 0) {
            let dato = dato1.getFullYear() + '-' + dato1.getMonth() + '-' + dato1.getDate();
            this.redigerObjekt.verktoyutleier[i].til_dato = dato;
          }

          if (this.dagerIMellom(dato2, ingenDato) > 0) {
            let dato = dato2.getFullYear() + '-' + dato2.getMonth() + '-' + dato2.getDate();
            this.redigerObjekt.verktoyutleier[i].til_dato = dato;
          }

          if (this.dagerIMellom(dato1, dato2) > 0) {
            dirty = true;
          }
        }
      }
    }

    if (dirty) {
      const r = confirm('Vil du lagre endringen før du henter inn ny plukkliste?');
      if (r === true) {
        this.lagre();
      } else {
        for (var i = 0; i < this.dataSource.filteredData.length; i++) {
          if (this.dataSource.filteredData[i].id === this.orginalobjekt.id) {
            for (let propt in this.orginalobjekt) {
              this.dataSource.filteredData[i][propt] = this.orginalobjekt[propt];
            }
            break;
          }
        }
      }
      for (let i = 0; i < this.dataSource.filteredData.length; i++) {
        if (this.dataSource.filteredData[i].id == e.id) {
          this.redigerObjekt = this.dataSource.filteredData[i];
          this.orginalobjekt = JSON.parse(JSON.stringify(this.redigerObjekt));
          this.dataSourcePlukk = new MatTableDataSource<any>(this.redigerObjekt.verktoyutleier);
        }
      }
    } else {
      for (let i = 0; i < this.dataSource.filteredData.length; i++) {
        if (this.dataSource.filteredData[i].id == e.id) {
          this.redigerObjekt = this.dataSource.filteredData[i];
          this.orginalobjekt = JSON.parse(JSON.stringify(this.redigerObjekt));
          this.dataSourcePlukk = new MatTableDataSource<any>(this.redigerObjekt.verktoyutleier);
        }
      }
    }
  }


  skrivUtDialog() {
    // console.log(JSON.stringify(this.redigerObjekt.verktoyutleier));
    this.lister.skrivUtPlukkliste(this.redigerObjekt);
  }

  avbryt() {
    this.orginalobjekt = JSON.parse('{"innlevert_til":""}');
    this.redigerObjekt = JSON.parse('{"innlevert_til":""}');
    this.dataSourcePlukk = new MatTableDataSource<any>([]);
  }


  lagre() {
    this.setRessurs(this.redigerObjekt).subscribe((response) => {
      this.redigerObjekt = response;
      this.dataSourcePlukk = new MatTableDataSource<any>(response.verktoy);
      this.orginalobjekt = JSON.parse('{"innlevert_til":""}');
      this.redigerObjekt = JSON.parse('{"innlevert_til":""}');

    },
      (error) => {
        this.feilmelding = error.code + ' ' + error.error;
      }
    );
  }


  ///////////// DATABASEKALL

  //private req = this.lister.reqstring + 'plukklister_TEST';
  private req = this.lister.reqstring + 'plukklister';
  private feilmelding;


  getRessurs(id) {
    const reqString = this.req + '/' + id;
    return this.http.get(reqString, this.authService.getOpts()).map(
      (response: Response) => {
        const data = response.json();
        return data.data;
      }
    )
      .catch(
      (error: Response) => {
        return Observable.throw(error.json());
      }
      );
  }



  setRessurs(ressurs: any[]) {
    const reqString = this.req + '/' + ressurs['id'];
    return this.http.put(reqString, ressurs, this.authService.getOpts()).map(
      (response: Response) => {
        const data = response.json();
        return data.data;
      }
    )
      .catch(
      (error: Response) => {
        return Observable.throw(error.json());
      }
      );
  }

  newRessurs(obj: any[]) {
    return this.http.post(this.req, obj, this.authService.getOpts()).map(
      (response: Response) => {
        const data = response.json();
        return data.data;
      }
    )
      .catch(
      (error: Response) => {
        return Observable.throw(error.json());
      }
      );
  }

  slettRessurs(id) {
    const reqString = this.req + '/' + id;
    return this.http.delete(reqString,
      this.authService.getOpts()).map(
      (response: Response) => {
        const data = response.json();
        return data.data;
      }
      ).catch(
      (error: Response) => {
        return Observable.throw(error.json());
      }
      );
  }

  getListe() {
    return this.http.get(this.req, this.authService.getOpts())
      .map(response => {
        return response.json().data;

      }).catch(
      (error: Response) => {
        return Observable.throw(error.json());
      }
      );
  }
}
