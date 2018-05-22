import * as jsPDF from 'jspdf';

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
import { DataStorageService } from '../../services/data-storage.service';

@Component({
  selector: 'app-fakturering',
  templateUrl: './fakturering.component.html',
  styleUrls: ['./fakturering.component.css'],
  providers: [
    { provide: 'Window', useValue: window }
  ]

})
export class FaktureringComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('form') signupForm: NgForm;


  private req = this.lister.reqstring + 'fakturaer';
  private feilmelding;
  panelOpenState = false;
  redigerObjekt: any;





  constructor(
    private dss: DataStorageService,
    private http: Http,
    private authService: AuthService,
    private lister: Lister,
    @Inject('Window') private window: Window,
  ) { }



  displayedColumns = ['navn', 'kunde', 'fakturadato'];
  dataSource;

  public aar; // = 2017;
  public maaned; // = 0;
  utleier_denne_maaneden: any[]; // =[];


  ngOnInit() {

    this.resetDisplay(new Date());
  }



  download(inn) {
    let utleiene;

    for (let i = 0; i < this.utleier_denne_maaneden.length; i++) {
      if (this.utleier_denne_maaneden[i].id == inn) {
        utleiene = this.utleier_denne_maaneden[i];
      }
    }

    let antall = 0;
    for (let i = 0; i < utleiene.utleier.length; i++) {
      antall = antall + (+utleiene.utleier[i].antall_overnattinger);
    }
    const doc = new jsPDF();

    let nedover = 50;
    let side = 1;

    let antallSider = 1;
    if (utleiene.utleier.length < 23) {
      antallSider = 1;
    }
    if (utleiene.utleier.length >= 24 && utleiene.utleier.length < 48) {
      antallSider = 2;
    }
    if (utleiene.utleier.length >= 48 && utleiene.utleier.length < 72) {
      antallSider = 3;
    }
    if (utleiene.utleier.length >= 72 && utleiene.utleier.length < 96) {
      antallSider = 4;
    }
    if (utleiene.utleier.length >= 96 && utleiene.utleier.length < 120) {
      antallSider = 5;
    }
    if (utleiene.utleier.length >= 120 && utleiene.utleier.length < 146) {
      antallSider = 6;
    }


    doc.text(20, 20, 'Fakturagrunnlag for ' + utleiene['navn'] + '  ' + this.lister.getMaanedsnavn(this.maaned) + ' - ' + this.aar);
    doc.setFontSize(9);
    doc.text(20, 30, 'Totalt antall for perioden er ' + antall + ' og er fordelt slik:');
    doc.setFontSize(9);

    const bortover1 = 20;
    const bortover2 = 30;
    const bortover3 = 75;
    const bortover4 = 110;
    const bortover5 = 120;

    doc.text(bortover1, nedover, 'ENH');
    doc.text(bortover2, nedover, 'NAVN');
    doc.text(bortover3, nedover, 'FRA-TIL');
    doc.text(bortover4, nedover, 'ANT.');
    doc.text(bortover5, nedover, 'KOMMENTAR');

    nedover = nedover + 10;

    doc.setTextColor(100);
    for (let i = 0; i < utleiene.utleier.length; i++) {
      if (!utleiene.utleier[i].kommentar) {
        utleiene.utleier[i].kommentar = '';
      }

      let fra = utleiene.utleier[i].fra_dato;
      let til = utleiene.utleier[i].til_dato;
      let fraDato = fra.substring(8, 10) + '.' + fra.substring(5, 7);// + '.' + fra.substring(0, 4);
      let tilDato = til.substring(8, 10) + '.' + til.substring(5, 7);//  + '.' + til.substring(0, 4);
      doc.text(bortover1, nedover, utleiene.utleier[i].rig.navn);

      doc.text(bortover2, nedover, utleiene.utleier[i].rig_gjest.navn);

      doc.text(
        bortover3,
        nedover,
        fraDato + ' - ' + tilDato);

      doc.text(bortover4, nedover, utleiene.utleier[i].antall_overnattinger);
      doc.text(bortover5, nedover, utleiene.utleier[i].kommentar);


      //  doc.text(80, nedover, '' + nedover);
      nedover = nedover + 10;
      if (nedover > 270) {
        doc.addPage();
        nedover = 10;
        doc.setTextColor(0);
        side = side + 1;
        doc.text(bortover1, nedover, 'ENH');
        doc.text(bortover2, nedover, 'NAVN');
        doc.text(bortover3, nedover, 'FRA-TIL');
        doc.text(bortover4, nedover, 'ANT.');
        doc.text(bortover5, nedover, 'KOMMENTAR' + ' (side ' + side + ' av ' + antallSider + ')');
        //   doc.text(bortover5, nedover, 'UTLEID TIL ' + ' (side ' + side + ' av ' + antallSider + ')');
        nedover = nedover + 10;
      }
      doc.setTextColor(100);
    }
    doc.save(utleiene['navn'] + '.pdf');
  }


  resetDisplay(dato) {
    this.aar = dato.getFullYear();
    this.maaned = dato.getMonth();
    this.getRig_faktura_kunde((this.maaned + 1), this.aar).subscribe(
      (rec: any[]) => {



        this.utleier_denne_maaneden = rec;


        for (const kunde of this.utleier_denne_maaneden) {

          kunde.utleier.sort((a, b) => a.rig_id - b.rig_id); // sorterer utleiene etter rig_id

        }
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


  navigerMaaned(item) {
    switch (item) {
      case 'ned': {
        this.resetDisplay(new Date(this.aar, this.maaned - 1, 1));
        break;
      }
      case 'opp': {
        this.resetDisplay(new Date(this.aar, this.maaned + 1, 1));
        break;
      }
      case 'opp_ett_aar': {
        this.resetDisplay(new Date(this.aar + 1, this.maaned, 1));
        break;
      }
      case 'ned_ett_aar': {
        this.resetDisplay(new Date(this.aar - 1, this.maaned, 1));
        break;
      }
      default: {
        this.resetDisplay(new Date(this.aar, item, 1));
        break;
      }
    }
  }



  getRiggOgUtleier(mnd, aar) {

    return this.http.get(this.lister.reqstring + 'rig_riggutleier/' + mnd + '/' + aar, this.authService.getOpts())

      .map(response => {
        return response.json().data;
      }).catch(
        (error: Response) => {

          return Observable.throw(error.json());
        }
      );
  }


  getRig_faktura_kunde(mnd, aar) {
    return this.http.get(this.lister.reqstring + 'rig_faktura_kunde/' + mnd + '/' + aar, this.authService.getOpts())

      .map(response => {
        return response.json().data;
      }).catch(
        (error: Response) => {

          return Observable.throw(error.json());
        }
      );
  }

}
