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
import { Lister } from '../../../services/lister';
import { DataSource } from '@angular/cdk/collections';
import { DataStorageService } from '../../../services/data-storage.service';

@Component({
  selector: 'app-prosjekt',
  templateUrl: './prosjekt.component.html',
  styleUrls: ['./prosjekt.component.css']
})
export class ProsjektComponent implements OnInit, OnChanges {


  @Input() objekt: any;
  @Output() verktoyEndret: EventEmitter<any> = new EventEmitter();
  @Output() tilLager: EventEmitter<any> = new EventEmitter();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourcePlukk = new MatTableDataSource<any>([]);
  displayedColumnsPlukk = ['velg', 'navn', 'ressursnummer', 'verktoygruppe'];

  constructor(
    private http: Http,
    private lister: Lister,
    private dss: DataStorageService,
  ) { }

  ngOnInit() { }

  leverTilLager(row) {

    const obj: any = { id: row.id, tilgjengelig: 'ledig', prosjekt_id: 'null' };
    this.dss.set(obj, 'verktoy').subscribe((response) => {
      row.tilgjengelig = 'ledig';
      row.prosjektod = null;
      this.tilLager.emit(row);
      for (let i = 0; i < this.objekt.verktoy.length; i++) {
        if (this.objekt.verktoy[i].id === row.id) {
          this.objekt.verktoy.splice(this.objekt.verktoy.indexOf(this.objekt.verktoy[i]), 1);

        }
      }
      this.dataSourcePlukk = new MatTableDataSource<any>(this.objekt.verktoy);
    }, (error) => {
      console.log(error.code + ' LINJE 52 ' + error.error);
    }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.objekt) {
      this.dataSourcePlukk = new MatTableDataSource<any>(this.objekt.verktoy);
    }
  }

  kanSettesLedig(element) {
    if (element.tilgjengelig === 'ledig' || element.tilgjengelig === 'utleid') {
      return false;
    } else {
      return true;
    }
  }

  ledig(inn) {
    if (inn.tilgjengelig !== 'utleid') {
      return 'highlight';
    } else {
      return 'utleid';
    }
  }

  ledigUtleid(element) {
    if (element !== 'utleid') {
      return 'utleid';
    } else {
      return 'ledig';
    }
  }

  setLedigUtleid(element) {
    if (element.tilgjengelig === 'ledig') {
      element.tilgjengelig = 'utleid';
    } else {
      element.tilgjengelig = 'ledig';
    }
    const obj: any = { id: element.id, tilgjengelig: element.tilgjengelig };
    this.dss.set(obj, 'verktoy').subscribe((response) => {
    }, (error) => {
    }
    );
  }

  settVerktoy(row) {
    this.verktoyEndret.emit(row);
  }
}
