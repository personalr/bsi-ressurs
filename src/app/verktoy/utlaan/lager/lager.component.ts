import { Lister } from './../../../services/lister';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource, MatPaginator, MatSort, Sort, MatSortable } from '@angular/material';
import { Component, OnInit, ViewChild, Output, Input } from '@angular/core';
import { NgForm, AbstractControl, FormControl, FormGroupDirective, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

// Disse tre skal slettes når kontakt med database er i egen service
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';

import { AuthService } from './../../../signin/auth.service';
import { DataSource } from '@angular/cdk/collections';
import { DataStorageService } from '../../../services/data-storage.service';

import { SimpleChanges } from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-lager',
  templateUrl: './lager.component.html',
  styleUrls: ['./lager.component.css']
})
export class LagerComponent implements OnInit, OnChanges {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('form') signupForm: NgForm;

  @Output() verktoyEndret: EventEmitter<any> = new EventEmitter();
  @Output() verktoyUtFraLager: EventEmitter<any> = new EventEmitter();

  @Input() lagerliste;

  feilmelding;
  filter;

  displayedColumns = ['navn', 'ressursnummer', 'verktoygruppe', 'tilgjengelig', 'reol', 'velg']; // , 'hylle', 'plass', 'velg'];
  // displayedColumnsPlukk = ['velg', 'navn', 'ressursnummer', 'verktoygruppe', 'tilgjengelig', 'reol', 'hylle', 'plass'];

  dataSource; // = new MatTableDataSource<Element>;//(ELEMENT_DATA);
  dataSourcePlukk = new MatTableDataSource<any>([]);

  date = new Date();

  public verktoKategoriValgt: boolean;
  public verktoykategori: string;

  constructor(
    private dss: DataStorageService,
    private http: Http,
    private lister: Lister,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.dss.getIndex('verktoy_lager').subscribe(
      (rec: any[]) => {
        this.dataSource = new MatTableDataSource<any>(rec);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }


  ngOnChanges(changes: SimpleChanges) {
    if (this.lagerliste) {
      const filteret = this.dataSource.filter;
      this.dataSource = new MatTableDataSource<any>(this.lagerliste);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filter = filteret;
      this.dataSource.sort.sort(<Sort>{ active: 'ressursnummer', direction: 'desc' });
      this.dataSource.sort.sort(<MatSortable>{ id: 'ressursnummer', start: 'desc' });
      this.verktoKategoriValgt = true;
    }
  }

  verktoyValgt(row) {
    this.verktoyEndret.emit(row);
  }


  lei(row) {
    const filteret = this.dataSource.filter;
    this.dataSource.data.splice(this.dataSource.data.indexOf(row), 1);
    this.dataSource = new MatTableDataSource<any>(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSourcePlukk.data.push(row);
    this.dataSourcePlukk = new MatTableDataSource<any>(this.dataSourcePlukk.data);
    this.dataSource.filter = filteret;
    this.dataSource.sort.sort(<Sort>{ active: 'ressursnummer', direction: 'desc' });
    this.dataSource.sort.sort(<MatSortable>{ id: 'ressursnummer', start: 'desc' });
    this.verktoKategoriValgt = true;

    this.verktoyUtFraLager.emit(row);
  }

/*
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.dataSource.sort.sort(<MatSortable>{ id: 'ressursnummer', start: 'desc' });
  }
*/

  velgVerktoykategori(e) {
    this.verktoykategori = e.value;
    e = e.value.trim(); // Remove whitespace
    e = e.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = e;
    this.dataSource.sort.sort(<Sort>{ active: 'ressursnummer', direction: 'desc' });
    this.dataSource.sort.sort(<MatSortable>{ id: 'ressursnummer', start: 'desc' });
    this.verktoKategoriValgt = true;
  }
}
