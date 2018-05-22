import { SimpleChanges } from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, Inject, Output, Input } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { NgForm, AbstractControl } from '@angular/forms';

import { FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

// Disse tre skal slettes når kontakt med database er i egen service
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from './../../signin/auth.service';
// import { Lister } from '../../services/lister';
// import { LocationStrategy } from '@angular/common';
import { DataStorageService } from '../../services/data-storage.service';


@Component({
  selector: 'app-gjestevelger',
  templateUrl: './gjestevelger.component.html',
  styleUrls: ['./gjestevelger.component.css']
})
export class GjestevelgerComponent implements OnInit, OnChanges {

  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild('form') signupForm: NgForm;

  @Output() gjestEndret: EventEmitter<any> = new EventEmitter();
  @Input() id;

  gjest;

  redigerObjekt: any;
  constructor(
    private dss: DataStorageService,
    private http: Http,
    //  private authService: AuthService,
    //  private lister: Lister
  ) { }

  displayedColumns = ['navn', 'kunde'];
  dataSource;
//  gjester: any[];

  ngOnInit() {
    console.log('########################')
    // this.authService.getToken();

    // this.getListe().subscribe(
    this.dss.getIndex('rig_gjester').subscribe(

      (recipes: any[]) => {

        for (const gjest of recipes) {
          gjest.kundenavn = gjest.rig_kunde.navn;
          //   if (gjest.id === this.id) {
          //   this.gjest = gjest;
          // }
        }

        this.dataSource = new MatTableDataSource<any>(recipes);
        this.dataSource.sort = this.sort;
    //    this.gjester = recipes;

      }
      ,
      (error) => {
      }
    );
  }



  ngOnChanges(changes: SimpleChanges) {
    this.gjest = null;
    if (this.id) {

      this.dss.getIndex('rig_gjester').subscribe(
        (recipes: any[]) => {
          this.dataSource.filter = '';
          for (const gjest of recipes) {
            gjest.kundenavn = gjest.rig_kunde.navn;
            if (gjest.id === this.id) {
              this.gjest = gjest;
            }
          }
          this.dataSource = new MatTableDataSource<any>(recipes);
          this.dataSource.sort = this.sort;
        }
        ,
        (error) => {
        }
      );
    }
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  visForslag() {
    if (this.dataSource) {
      if (this.dataSource.filter.length < 1) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  velgElement(row) {
    console.log(row);
    this.dataSource.filter = '';
  }

}
