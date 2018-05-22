// tslint:disable:member-ordering
import { Component, OnInit, Input, Output } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource, MatPaginator, MatSort, Sort, MatSortable } from '@angular/material';
import { ViewChild } from '@angular/core';
import { NgForm, AbstractControl, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from './../../../signin/auth.service';
import { Lister } from '../../../services/lister';
import { DataSource } from '@angular/cdk/collections';
import { DataStorageService } from '../../../services/data-storage.service';

@Component({
  selector: 'app-prosjektliste',
  templateUrl: './prosjektliste.component.html',
  styleUrls: ['./prosjektliste.component.css']
})
export class ProsjektlisteComponent implements OnInit, OnChanges {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output() prosjektEndret: EventEmitter<any> = new EventEmitter();
  @Input() prosjektliste;
  @Input() prosjekt;

  private feilmelding;
  displayedColumns = ['prosjektnavn', 'prosjekt_id'];

  dataSource; // = new MatTableDataSource<Element>;//(ELEMENT_DATA);
  verktoy: any;

  constructor(
    private http: Http,
    private authService: AuthService,
    private lister: Lister,
    private dss: DataStorageService,
  ) { }
  /*
    settVerktoy(row) {
      this.verktoy = row.verktoy;
    }
  */



  ngOnInit() {
    this.dss.getIndex('prosjekter').subscribe(
      (rec: any[]) => {
        this.prosjektliste = rec;
        this.dataSource = new MatTableDataSource<any>(this.prosjektliste);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }



  getClass(row) {
    if (this.prosjekt) {
      if (row.id === this.prosjekt.id) {
        return 'selected';
      } else {
        return 'highlight';
      }
    } else {
      return 'highlight';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.prosjektliste) {
      const filteret = this.dataSource.filter;
      this.dataSource = new MatTableDataSource<any>(this.prosjektliste);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filter = filteret;
    }
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.dataSource.sort.sort(<MatSortable>{ id: 'ressursnummer', start: 'desc' });
  }

  aapneElement(e) {
    console.log('her må det lages en output til utlaan.component');
    this.prosjektEndret.emit(e);
  }




}
