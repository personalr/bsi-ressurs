import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { Observable } from 'rxjs/Observable';
import { DataStorageService } from './../services/data-storage.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { NgForm, AbstractControl } from '@angular/forms';

import { FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';



// Disse tre skal slettes når kontakt med database er i egen service
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from './../signin/auth.service';
import { Lister } from '../services/lister';



@Component({
  selector: 'app-brukere',
  templateUrl: './brukere.component.html',
  styleUrls: ['./brukere.component.css']
})
export class BrukereComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('form') signupForm: NgForm;

  redigerObjekt: any;

  checked = true;
  indeterminate = true;
  // roller = true;

  // http og authService kan fjernes når service er på plass
  constructor(
    private dss: DataStorageService,
    private http: Http,
    private authService: AuthService,
    private lister: Lister
  ) { }

  // tslint:disable-next-line:member-ordering
  displayedColumns = ['name', 'email', 'isAdmin'];
  // tslint:disable-next-line:member-ordering
  dataSource; // = new MatTableDataSource<Element>;//(ELEMENT_DATA);
  // red = 'red';


  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  public isVerified;  // =this.redigerObjekt.is// this.options2[1].id;

  public isAdmin;

  // tslint:disable-next-line:no-unused-expression
  // this.lister.reqstring + 'roller';

  public rollene: any[];

  ngOnInit() {
    this.authService.getToken();
    //  this.getUsers().subscribe(
    this.dss.getIndex('users').subscribe(
      (rec: any[]) => {
        //     console.log(rec);
        this.dataSource = new MatTableDataSource<any>(rec);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );


    /*
  private req = this.lister.reqstring + 'users';
  getUsers() {
    return this.http.get(this.req, this.authService.getOpts())
      .map(response => {
        return response.json().data;
      }).catch(
      (error: Response) => {
        console.log(error);
        return Observable.throw(error.json());
      }
      );
  }
*/


    /*
      getRoller() {
        return this.http.get(this.lister.reqstring + 'roller', this.authService.getOpts())
          .map(response => {
            return response.json().data;
          }).catch(
          (error: Response) => {
            console.log(error);
            return Observable.throw(error.json());
          }
          );
      }
    */

    // this.getRoller().subscribe

    this.dss.getIndex('roller').subscribe
      (
      (recipes: any[]) => {
        this.rollene = recipes;
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
    this.isVerified = null;
    this.isAdmin = null;
  }

  leggTilNy() {
    this.redigerObjekt = JSON.parse('{"id":"ny","navn":""}');
  }

  slett(form) {
    const r = confirm('Følgende bruker slettes: \nNavn: ' + form.value.name +
      '\nEmail: ' + form.value.email);
    if (r === true) {




      /*
        // private req = this.lister.reqstring + 'users';
        slettRessurs(id) {
          const reqString = this.req + '/' + id;
          return this.http.delete(reqString,
            this.authService.getOpts()).map(
              (response: Response) => {
                const data = response.json();
                return data.data;
              }
            ).catch(
              (error: Response) => {
                console.log(error);
                return Observable.throw(error.json());
              }
            );
        }
      */



      //  this.slettRessurs(form.value.id).subscribe((response) => {
      this.dss.slett(form.value.id, 'users').subscribe((response) => {

        // this.getUsers().subscribe(
        this.dss.getIndex('users').subscribe(
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
      //  txt = 'You pressed Cancel!';
    }
  }





  aapneElement(e) {
    this.redigerObjekt = e;
    this.isVerified = e.isVerified;
    this.isAdmin = e.isAdmin;

    for (const rolle of this.rollene) {
      rolle.checked = false;
    }

    for (const entry of e.roller) {
      for (const rolle of this.rollene) {
        if (entry.id === rolle.id) {
          rolle.checked = true;
        }
      }
    }
  }


  rediger(form) {

    form.value.roller = [];
    for (const rolle of this.rollene) {
      if (rolle.checked === true) {
        form.value.roller.push(rolle.id);
      }
    }


    if (form.value.id === 'ny') {
      delete form.value.id;





      this.dss.ny(form.value, 'users').subscribe((response) => {


        this.dss.getIndex('users').subscribe(
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







      this.dss.set(form.value, 'users').subscribe((response) => {

        this.dss.getIndex('users').subscribe(
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
