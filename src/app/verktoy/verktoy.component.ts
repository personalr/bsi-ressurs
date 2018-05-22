// tslint:disable:member-ordering
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource, MatPaginator, MatSort, Sort, MatSortable } from '@angular/material';
import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { NgForm, AbstractControl, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { AuthService } from './../signin/auth.service';
import { Lister } from '../services/lister';

import { DataSource } from '@angular/cdk/collections';
import { DataStorageService } from '../services/data-storage.service';


@Component({
  selector: 'app-verktoy',
  templateUrl: './verktoy.component.html',
  styleUrls: ['./verktoy.component.css'],
})
export class VerktoyComponent implements OnInit {

  //  @Output() open: EventEmitter<any> = new EventEmitter();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('form') signupForm: NgForm;

  redigerObjekt: any;

  date = new Date();


  constructor(
    private dss: DataStorageService,
    private http: Http,
    private authService: AuthService,
    private lister: Lister
  ) { }


  displayedColumns = ['navn', 'ressursnummer', 'verktoygruppe', 'tilgjengelig', 'reol', 'hylle', 'plass'];
  dataSource; // = new MatTableDataSource<Element>;//(ELEMENT_DATA);


  private req = this.lister.reqstring + 'verktoy';


  ngOnInit() {
    //    this.authService.getToken();
    this.dss.getIndex('verktoy').subscribe(
      (rec: any[]) => {
        this.dataSource = new MatTableDataSource<any>(rec);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }


  ledig(inn) {
    if (inn === 'ledig') {
      return 'highlight';
    } else {
      return 'utleid';
    }
  }

  verktoyadministrasjon = true;
  innlevering = false;
  utlan = false;
  onOpen(event) {
    //    console.log('TAB NAVN ' + event.tab.textLabel);
    switch (event.tab.textLabel) {
      case 'Verktøyadministrasjon': {
        const filteret = this.dataSource.filter;
        this.innlevering = false;
        this.utlan = false;
        this.verktoyadministrasjon = true;
        this.dss.getIndex('verktoy').subscribe(
          (rec: any[]) => {
            this.dataSource = new MatTableDataSource<any>(rec);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.dataSource.filter = filteret;
            this.avbryt();

          }
        );

        break;

      }
      case 'Innlevering': {
        this.verktoyadministrasjon = false;
        this.utlan = false;
        this.innlevering = true; // (new Date(this.aar, this.maaned + 1, 1));
        break;
      }
      case 'Utlån': {
        this.verktoyadministrasjon = false;
        this.innlevering = false;
        this.utlan = true;
        break;
      }

      default: {
        this.verktoyadministrasjon = true;
        this.innlevering = false;
        this.utlan = false;
        break;
      }
    }

  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.dataSource.sort.sort(<MatSortable>{ id: 'ressursnummer', start: 'desc' });
  }

  nyttVerktoyTooltip(){
    if(this.verktoKategoriValgt){
      return 'Legg til nytt verktøy'
    }else{
    return 'Du må velge verktøykategori før du kan legge til nytt verktøy';
    }
  }
  apply(e) {

    e = e.value.trim(); // Remove whitespace
    e = e.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = e;
    this.dataSource.sort.sort(<Sort>{ active: 'ressursnummer', direction: 'desc' });
    this.dataSource.sort.sort(<MatSortable>{ id: 'ressursnummer', start: 'desc' });
  }

  // tslint:disable-next-line:member-ordering
  public verktoKategoriValgt: boolean;
  // tslint:disable-next-line:member-ordering
  public verktoykategori: string;

  velgVerktoykategori(e) {
    this.verktoKategoriValgt = true;
    this.verktoykategori = e.value;
    if (e.value === 'Alle') {
      e.value = '';
      this.verktoKategoriValgt = false;
    }

    e = e.value.trim(); // Remove whitespace
    e = e.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = e;
    this.dataSource.sort.sort(<Sort>{ active: 'ressursnummer', direction: 'desc' });
    this.dataSource.sort.sort(<MatSortable>{ id: 'ressursnummer', start: 'desc' });

  }



  avbryt() {
    this.redigerObjekt = null;
  }



  leggTilNy() {
    this.redigerObjekt = JSON.parse('{"id":"ny","navn":"","x_0":"' + this.verktoykategori + '"}');
    this.redigerObjekt.innkjopsdato = new Date();
  }

  navn = new FormControl('', [Validators.required]);
  idnr = new FormControl('', [Validators.required]);

  getErrorMessage() {
    return this.navn.hasError('required') ? 'Felt må fylles ut' :
      '';
  }

  lagreNyttVektoy(navnCtrl, idnrCtrl) {
    const date = new Date();
    // const mnd = date.getMonth() + 1;

    const obj: any = {
      navn: navnCtrl,
      ressursnummer: idnrCtrl, x_0:
        this.redigerObjekt.x_0,
      innkjopsdato: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear(),
      tilgjengelig: 'ledig'
    };
    this.dss.ny(obj, 'verktoy').subscribe((response) => {
      this.redigerObjekt = response;
      this.dss.getIndex('verktoy').subscribe(
        (rec: any[]) => {
          this.dataSource = new MatTableDataSource<any>(rec);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.velgVerktoykategori({ value: this.redigerObjekt.x_0 });
          this.navn = new FormControl('', [Validators.required]);
          this.idnr = new FormControl('', [Validators.required]);
        }
      );

    }, (error) => {
      console.log(error.code + ' LINJE 199 ' + error.error);
    }
    );

  }

  aapneElement(e) {
    console.log(JSON.stringify(e));
    this.redigerObjekt = e;
    this.date = new Date(e.innkjopsdato);
  }

  slett() {
    const r = confirm('Følgende verktøy slettes: \nNavn: ' + this.redigerObjekt.navn );
  if (r === true) {

    this.dss.slett(this.redigerObjekt.id, 'verktoy').subscribe((response) => {
      // const event: any = { value: this.redigerObjekt.x_0};

      this.dss.getIndex('verktoy').subscribe(
        (rec: any[]) => {
          this.dataSource = new MatTableDataSource<any>(rec);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.velgVerktoykategori({ value: this.redigerObjekt.x_0 });
        }
      );


    },
      (error) => {
      }
    );
  }
  }

}
