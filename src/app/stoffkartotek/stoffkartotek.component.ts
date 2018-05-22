// tslint:disable:max-line-length
// tslint:disable:member-ordering
import { DomSanitizer } from '@angular/platform-browser';
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
import { truncateSync } from 'fs';
// import { DataStorageService } from '../services/data-storage.service';

@Component({
  selector: 'app-stoffkartotek',
  templateUrl: './stoffkartotek.component.html',
  styleUrls: ['./stoffkartotek.component.css']
})
export class StoffkartotekComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('form') signupForm: NgForm;

  redigerObjekt: any;
  checked = true;
  indeterminate = true;
  // roller = true;

  // http og authService kan fjernes når service er på plass
  constructor(// private ds: DataStorageService,
    private http: Http,
    private authService: AuthService,
    private lister: Lister,
    private dss: DataStorageService,
    private sanitizer: DomSanitizer
  ) { }

  displayedColumns = ['navn', 'leverandor', 'revisjonsdato', 'faresetninger', 'farepiktogram', 'fareklasse', 'verneutstyr'];
  dataSource; // = new MatTableDataSource<Element>;//(ELEMENT_DATA);

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  getFareklasseColor(inn) {
    switch (inn) {
      case '1': {
        return 'green';
      }
      case '2': {
        return 'green';
      }
      case '3': {
        return 'yellow';
      }
      case '4': {
        return 'yellow';
      }
      case '5': {
        return 'red';
      }
      case '6': {
        return 'red';
      }
      default: {
        return '';
      }
    }
  }

  public farepiktogrammene: any[];
  private readonly imageType: string = 'data:image/JPG;base64,';


  ngOnInit() {
    this.authService.getToken();
    this.setUp();
    this.dss.getIndex('farepiktogrammer').subscribe
      (
      (recipes: any[]) => {
        this.farepiktogrammene = recipes;
        for (let i = 0; i < this.farepiktogrammene.length; i++) {
          this.farepiktogrammene[i].image = this.sanitizer.bypassSecurityTrustUrl(this.imageType + this.farepiktogrammene[i].image);
        }
      }
      );
  }



  datoValid(e) {
    if (e.trim().length === 0) {
      return true;
    }

    return /^\d{2}\-\d{2}\-\d{4}/.test(e);
  }


  fareklasseValid(e) {
    switch (e) {
      case '1': {
        return true;
      }
      case '2': {
        return true;
      }
      case '3': {
        return true;
      }
      case '4': {
        return true;
      }
      case '5': {
        return true;
      }
      case '6': {
        return true;
      }
      default: {
        return false;
      }
    }
  }





  updateStyle(bol) {
    if (bol) {
      return '#f1b1b1';
    }
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  avbryt() {
    if (this.signupForm) {
      let control: AbstractControl = null;
      this.signupForm.reset();
      this.signupForm.form.markAsUntouched();
      Object.keys(this.signupForm.controls).forEach((name) => {
        control = this.signupForm.controls[name];
        control.setErrors(null);
      });
    }
    this.redigerObjekt = null;
  }

  leggTilNy() {
    this.avbryt();
    this.redigerObjekt = JSON.parse('{"id":"ny","navn":""}');
  }

  slett(form) {
    const r = confirm('Følgende stoff slettes: \nNavn: ' + form.value.navn);
    if (r === true) {
      this.dss.slett(form.value.id, 'stoffer').subscribe((response) => {
  
        this.dss.getIndex('stoffer').subscribe(
          (recipes: any[]) => {
            for (let i = 0; i < recipes.length; i++) {
              for (let j = 0; j < recipes[i].farepiktogrammer.length; j++) {
                recipes[i].farepiktogrammer[j].image = this.sanitizer.bypassSecurityTrustUrl(this.imageType + recipes[i].farepiktogrammer[j].image);
              }
            }
            this.dataSource = new MatTableDataSource<any>(recipes);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.avbryt();
          }
        );
      },
        (error) => {
        }
      );


    }
  }





  aapneElement(e) {
    this.redigerObjekt = e;
    for (const farepiktogram of this.farepiktogrammene) {
      farepiktogram.checked = false;
    }

    for (const entry of e.farepiktogrammer) {
      for (const farepiktogram of this.farepiktogrammene
      ) {
        if (entry.id === farepiktogram.id) {
          farepiktogram.checked = true;
        }
      }
    }
  }

  endrerPdf(element) {
    if (element.nytt_image) {
      this.redigerObjekt.image_id = element.nytt_image;
      const obj: any = { id: this.redigerObjekt.id, image_id: element.nytt_image };
      this.dss.set(obj, 'stoffer').subscribe((response) => {
        this.setUp();
      },
        (error) => {
        }
      );
    }
    if (element.slett_image) {
      console.log('parent registrerer endring: sletter ');
      const obj: any = { id: this.redigerObjekt.id, image_id: 'slett' };
      this.dss.set(obj, 'stoffer').subscribe((response) => {
        this.setUp();
      },
        (error) => {
        }
      );
    }
  }


  rediger(form) {
    this.redigerObjekt = form.value;
    form.value.farepiktogrammer = [];
    for (const farepiktogram of this.farepiktogrammene) {
      if (farepiktogram.checked === true) {
        form.value.farepiktogrammer.push(farepiktogram.id);
      }
    }
    if (form.value.id === 'ny') {
      delete form.value.id;
      this.dss.ny(form.value, 'stoffer').subscribe((response) => {
        this.setUp();
        this.redigerObjekt = response;
      },
        (error) => {
        }
      );
    } else {
      this.dss.set(form.value, 'stoffer').subscribe((response) => {
        this.setUp();
        this.redigerObjekt = response;

      },
        (error) => {
        }
      );
    }
  }

  setUp() {
    this.dss.getIndex('stoffer').subscribe(
      (rec: any[]) => {
        for (let i = 0; i < rec.length; i++) {
          for (let j = 0; j < rec[i].farepiktogrammer.length; j++) {
            rec[i].farepiktogrammer[j].image = this.sanitizer.bypassSecurityTrustUrl(this.imageType + rec[i].farepiktogrammer[j].image);
          }
        }

        this.dataSource = new MatTableDataSource<any>(rec);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }
}
