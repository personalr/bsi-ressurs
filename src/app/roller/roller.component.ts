import { DataStorageService } from './../services/data-storage.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { NgForm, AbstractControl } from '@angular/forms';

import { FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

// Disse tre skal slettes når kontakt med database er i egen service
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Lister } from '../services/lister';




@Component({
  selector: 'app-roller',
  templateUrl: './roller.component.html',
  styleUrls: ['./roller.component.css']
})
export class RollerComponent implements OnInit {



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('form') signupForm: NgForm;



  redigerObjekt: any;
  constructor(
    private dss: DataStorageService,
    private lister: Lister
  ) { }

  displayedColumns = ['navn'];
  dataSource;


  ngOnInit() {
    this.dss.getIndex('roller').subscribe(
      (recipes: any[]) => {
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

  avbryt(form) {
    let control: AbstractControl = null;
    this.signupForm.reset();
    this.signupForm.form.markAsUntouched();
    Object.keys(this.signupForm.controls).forEach((name) => {
      control = this.signupForm.controls[name];
      control.setErrors(null);
    });

    this.redigerObjekt = null;

  }

  leggTilNy() {
    this.redigerObjekt = JSON.parse('{"id":"ny","navn":""}');

  }

  slett(form) {
    const r = confirm('Følgende rolle slettes: \nNavn: ' + form.value.navn);
    if (r === true) {

      this.dss.slett(form.value.id, 'roller').subscribe((response) => {
        this.dss.getIndex('roller').subscribe(
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

    } else {
    }
  }


  aapneElement(e) {
    this.redigerObjekt = e;
  }

  rediger(form) {
    console.log(JSON.stringify(form.value));

    if (form.value.id === 'ny') {
      delete form.value.id;
      //  this.newRessurs(form.value).subscribe((response) => {
      this.dss.ny(form.value, 'roller').subscribe((response) => {
        // this.getListe().subscribe(
        this.dss.getIndex('roller').subscribe(
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

    } else {
      this.dss.set(form.value, 'roller').subscribe((response) => {
        this.redigerObjekt = null;
        this.dss.getIndex('roller').subscribe(
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
}