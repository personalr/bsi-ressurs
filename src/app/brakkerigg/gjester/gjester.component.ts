import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { NgForm, AbstractControl } from '@angular/forms';

import { FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

// Disse tre skal slettes når kontakt med database er i egen service
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from './../../signin/auth.service';
import { Lister } from '../../services/lister';
import { LocationStrategy } from '@angular/common';
import { DataStorageService } from '../../services/data-storage.service';


@Component({
  selector: 'app-gjester',
  templateUrl: './gjester.component.html',
  styleUrls: ['./gjester.component.css']
})
export class GjesterComponent implements OnInit {



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('form') signupForm: NgForm;



  private feilmelding;

  redigerObjekt: any;
  // http og authService kan fjernes når service er på plass



  constructor(
    private dss: DataStorageService,
    private http: Http,
    private authService: AuthService,
    private lister: Lister
  ) { }

  displayedColumns = ['navn', 'kunde'];
  dataSource;


  ngOnInit() {
    // this.authService.getToken();

    // this.getListe().subscribe(
    this.dss.getIndex('rig_gjester').subscribe(

      (recipes: any[]) => {

        for (const gjest of recipes) {
          gjest.kundenavn = gjest.rig_kunde.navn;
        }

        this.dataSource = new MatTableDataSource<any>(recipes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }
      ,
      (error) => {
      }
    );

    // getKundeDropdown()

    this.dss.getIndex('rig_kunder_dropdown').subscribe( //   getKundeDropdown().subscribe(
      (recipes: any[]) => {
        this.kunderDD = recipes;
      }
      ,
      (error) => {
      }
    );

  }

  // tslint:disable-next-line:member-ordering
  kunderDD: any[];


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
    this.redigerObjekt = JSON.parse('{"id":"ny","kunde_id":"","navn":"","rig_kunde":{"id":"ny","navn":"","prefiks":""}}');


  }

  slett(form) {
    const r = confirm('Følgende gjest slettes: \nNavn: ' + form.value.navn);
    if (r === true) {
      //      this.slettRessurs(form.value.id).subscribe((response) => {

      this.dss.slett(form.value.id, 'rig_gjester').subscribe((response) => {

        //this.getListe().subscribe(
        this.dss.getIndex('rig_gjester').subscribe(

          (recipes: any[]) => {


            for (const gjest of recipes) {
              gjest.kundenavn = gjest.rig_kunde.navn;
            }


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
      //  txt = 'You pressed Cancel!';
    }
  }


  aapneElement(e) {
    this.redigerObjekt = e;
  }

  rediger(form) {

    if (form.value.id === 'ny') {
      delete form.value.id;
      //  this.newRessurs(form.value).subscribe((response) => {
      this.dss.ny(form.value, 'rig_gjester').subscribe((response) => {
        //  this.getListe().subscribe(
        this.dss.getIndex('rig_gjester').subscribe(

          (recipes: any[]) => {


            for (const gjest of recipes) {
              gjest.kundenavn = gjest.rig_kunde.navn;
            }


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


      this.dss.set(form.value, 'rig_gjester').subscribe((response) => {
        this.redigerObjekt = null;


        this.dss.getIndex('rig_gjester').subscribe(
          (recipes: any[]) => {

            for (const gjest of recipes) {
              gjest.kundenavn = gjest.rig_kunde.navn;
            }


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
