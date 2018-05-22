// tslint:disable:member-ordering
// tslint:disable:max-line-length
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource, MatPaginator, MatSort, Sort, MatSortable } from '@angular/material';
import { Component, OnInit, ViewChild, Output, Input } from '@angular/core';
import { NgForm, AbstractControl, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { AuthService } from './../../signin/auth.service';
import { Lister } from '../../services/lister';
import { DataSource } from '@angular/cdk/collections';
import { DataStorageService } from '../../services/data-storage.service';
import { SimpleChanges } from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-verktoydetaljer',
  templateUrl: './verktoydetaljer.component.html',
  styleUrls: ['./verktoydetaljer.component.css']
})
export class VerktoydetaljerComponent implements OnInit, OnChanges {
  @Input() objekt: any;
  private feilmelding;
  constructor(
    private dss: DataStorageService,
    private http: Http,
    private authService: AuthService,
    private lister: Lister
  ) { }

  ngOnInit() { }

  faaEnDateTilbake(inn) {
    if ((inn).constructor === Date) {
      console.log('Dette er en dato');
      return inn;
    } else {
      // console.log(typeof (this.objekt.innkjopsdato) + 'HELE DATOEN:' + this.objekt.innkjopsdato);
   //   console.log('år:' + inn.substring(6, 10));
   //   console.log('mnd:' + inn.substring(3, 5));
   //   console.log('dag:' + inn.substring(0, 2));
      const tilDato = inn.substring(6, 10) + '.' + inn.substring(3, 5) + '.' + inn.substring(0, 2);
      return new Date(tilDato);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
//    console.log('SKJER DET NOE HER?  ');
    if (this.objekt) {
      this.objekt.innkjopsdato = this.faaEnDateTilbake(this.objekt.innkjopsdato);
    }
  }

  avbryt() {
    this.objekt = null;
  }

  rediger() {
    const obj: any = { id: this.objekt.id, tilgjengelig: this.objekt.tilgjengelig };

    this.setVerktoy(obj);
  }

  setVerktoyGruppe(e) {
    this.objekt.x_0 = e.value;
    const obj: any = { id: this.objekt.id, x_0: this.objekt.x_0 };
    this.setVerktoy(obj);
  }

  onBlur(attr, verdi) {
    switch (attr) {
      case 'navn': {
        this.objekt.navn = verdi.value;
        const obj: any = { id: this.objekt.id, navn: this.objekt.navn };
        this.setVerktoy(obj);
        break;
      }
      case 'ressursnummer': {
        this.objekt.ressursnummer = verdi.value;
        const obj: any = { id: this.objekt.id, ressursnummer: this.objekt.ressursnummer };
        this.setVerktoy(obj);
        break;
      }
      case 'x_2': {
        this.objekt.x_2 = verdi.value;
        const obj: any = { id: this.objekt.id, x_2: this.objekt.x_2 };
        this.setVerktoy(obj);
        break;
      }

      case 'x_3': {
        this.objekt.x_3 = verdi.value;
        const obj: any = { id: this.objekt.id, x_3: this.objekt.x_3 };
        this.setVerktoy(obj);
        break;
      }
      case 'x_4': {
        this.objekt.x_4 = verdi.value;
        const obj: any = { id: this.objekt.id, x_4: this.objekt.x_4 };
        this.setVerktoy(obj);
        break;
      }
      default: {
        break;
      }
    }
  }


  setStatus(e) {
    console.log(e.value);
    this.objekt.tilgjengelig = e.value;
    const obj: any = { id: this.objekt.id, tilgjengelig: this.objekt.tilgjengelig };
    this.setVerktoy(obj);
  }

  updateMyDate(dato) {
    let dd = dato.getDate();
    let mm = dato.getMonth() + 1;
    const yyyy = dato.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    dato = dd + '-' + mm + '-' + yyyy;
    this.objekt.innkjopsdato = this.faaEnDateTilbake(dato);
    const obj: any = { id: this.objekt.id, innkjopsdato: dato };
    this.setVerktoy(obj);
  }

  setVerktoy(obj) {
    this.dss.set(obj, 'verktoy').subscribe((response) => {
    }, (error) => {
      console.log(error.code + ' LINJE 137 ' + error.error);
    }
    );
  }
}
