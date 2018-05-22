// import { MAT_DATE_LOCALE } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource, MatPaginator, MatSort, Sort, MatSortable } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, AbstractControl, FormControl, FormGroupDirective, Validators } from '@angular/forms';


import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


// Disse tre skal slettes når kontakt med database er i egen service
// import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
// import { AuthService } from './../../signin/auth.service';
// import { Lister } from '../../services/lister';

// import {MatSortModule} from '@angular/material/sort';


// import {MatCheckboxModule} from '@angular/material/checkbox';
// import {  Inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { DataStorageService } from '../../services/data-storage.service';
// import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-brakker',
  templateUrl: './brakker.component.html',
  styleUrls: ['./brakker.component.css']
})
export class BrakkerComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  redigerObjekt: any;

  displayedColumns = ['navn', 'rengjort'];
  dataSource;


  constructor(
    private dss: DataStorageService,
  //  private http: Http,
 //   private authService: AuthService,
  //  private lister: Lister
  ) { }



  // rigger
  ngOnInit() {

    //  this.getUsers().subscribe(
    this.dss.getIndex('rigger').subscribe( //  getUsers().subscribe(

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



  avbryt(rengjortCtrl, nameCtrl) {
    this.redigerObjekt = null;
  }


  aapneElement(e) {
    this.redigerObjekt = e;
  }


  lagre(rengjortCtrl) {
    const obj: any = {
      id: this.redigerObjekt.id,
      rengjort: rengjortCtrl.value,
    };

    this.dss.set(obj, 'rigger').subscribe((response) => {
      this.dss.getIndex('rigger').subscribe( //  getUsers().subscribe(
        (recipes: any[]) => {
          this.dataSource = new MatTableDataSource<any>(recipes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      );

    },
      (error) => {
      }
    );
  }
}
