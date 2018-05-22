import { DataStorageService } from './../services/data-storage.service';
import { FormGroup, Validators } from '@angular/forms';
// tslint:disable:comment-format
// tslint:disable:member-ordering
// tslint:disable:max-line-length

import { ViewChild } from '@angular/core';
import { Component, OnInit, Input, Output, SimpleChanges, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { AbstractControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from './../signin/auth.service';
import { Lister } from '../services/lister';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-arbeidstoy',
  templateUrl: './arbeidstoy.component.html',
  styleUrls: ['./arbeidstoy.component.css']
})
export class ArbeidstoyComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  redigerObjekt: any;

  constructor(public dss: DataStorageService, public lister: Lister) { }

  displayedColumns = ['navn', 'storrelse', 'antall', 'uttak', 'innlevering', 'knapper'];
  dataSource;

  ngOnInit() {
    //  this.authService.getToken();
    this.dss.getIndex('arbeidstoy').subscribe(
      (recipes: any[]) => {
        for (let i = 0; i < recipes.length; i++) {
          recipes[i].dirty = false;
          recipes[i].edit = false;
        }
        this.dataSource = new MatTableDataSource<any>(recipes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      ,
      (error) => {
      }
    );

  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

rediger(id){
  console.log(this.dataSource);



}

toggleEnabledElement(row){

}


  leggTilNy() {
    console.log(this.dataSource.filteredData);
    this.redigerObjekt = {
      id: 'ny',
      navn: '',
      storrelse: '',
      antall: '',
      uttak: '',
      innlevering: '',
      dirty: true,
      edit: true,
    };
    this.dataSource.filteredData.unshift(this.redigerObjekt);
    this.dataSource = new MatTableDataSource<any>(this.dataSource.filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  aapneElement(e) {
    this.redigerObjekt = e;
  }

  redigerObjektEndret(objekt: any) {

    if (objekt.nytt_image) {
      this.redigerObjekt.image_id = objekt.nytt_image;

    } else {
      console.log(objekt);
      this.dss.getIndex('arbeidstoy').subscribe(
        (recipes: any[]) => {
          this.dataSource = new MatTableDataSource<any>(recipes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      );

    }


  }
}
