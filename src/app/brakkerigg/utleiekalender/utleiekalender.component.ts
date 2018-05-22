// tslint:disable:max-line-length
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource, MatPaginator, MatSort, Sort, MatSortable, MatGridList } from '@angular/material';
import { Component, OnInit, ViewChild, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { NgForm, AbstractControl, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
// Disse tre skal slettes når kontakt med database er i egen service
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from './../../signin/auth.service';
import { Lister } from '../../services/lister';

import { DataSource } from '@angular/cdk/collections';



// import { Directive, HostListener, ElementRef } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';


@Component({
  selector: 'app-utleiekalender',
  templateUrl: './utleiekalender.component.html',
  styleUrls: ['./utleiekalender.component.css']
})
export class UtleiekalenderComponent implements OnInit {



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;




  antallDagerImnd = 31;
  kolonner = 32;
  datoer1 = [];
  riggene: any[];
  utleie: any = {};
  feilmelding;
  public antallDagerImaaned;


  public aar; // = 2017;
  public maaned; // = 0;
  // public dager: any[]; // = [];
  // public maanednavn = 'april';
  utleier_denne_maaneden: any[]; // =[];
  //  redigerRomObjekt: any;
  //  redigerRomVis: string;
  tileveggen;
  private req = this.lister.reqstring + 'rigger';


  constructor(
    private dss: DataStorageService,
    private http: Http,
    private authService: AuthService,
    private lister: Lister,
    private renderer: Renderer2,
  ) { }


  gjester: any[];
  kunderDD: any[];
  dataSource;
  displayedColumns = ['navn', 'kunde'];











  ngOnInit() {
  
    this.dss.getIndex('rig_gjester').subscribe(
      (recipes: any[]) => {


        this.gjester = recipes;


      }
      ,
      (error) => {
      }
    );



    //  this.getKundeDropdown().subscribe(

    this.dss.getIndex('rig_kunder_dropdown').subscribe(

      (recipes: any[]) => {
        this.kunderDD = recipes;
      }
      ,
      (error) => {
      }
    );
    this.resetDisplay(new Date());
  }



  // tslint:disable-next-line:member-ordering
  sokeliste = false;
  applyFilter(filterValue: string) {
    this.sokeliste = true;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  settKunde(row) {
    //  console.log(JSON.stringify(row));
    this.sokeliste = false;
  }


  aapne(e) {
   // console.log(e);
    const frad = e.fra_dato.split('-', 3);
    const tild = e.til_dato.split('-', 3);
    if (frad[1].length < 2) {
      frad[1] = '0' + frad[1];
    }
    if (tild[1].length < 2) {
      tild[1] = '0' + tild[1];
    }
    if (frad[2].length < 2) {
      frad[2] = '0' + frad[2];
    }
    if (tild[2].length < 2) {
      tild[2] = '0' + tild[2];
    }

    e.fra_dato = frad[0] + '-' + frad[1] + '-' + frad[2];

    e.til_dato = tild[0] + '-' + tild[1] + '-' + tild[2];

    if (e.id === 'ny') {
      e.rig_gjest = JSON.parse('{"id":"", "kunde_id": "", "navn": "","kommentar":"","rig_kunde": { "id":"" , "navn": "", "prefiks": ""}}');
      this.utleie = e;
      //   console.log(this.utleie);
    } else {
      // riggutleier
      this.dss.get(e.id, 'riggutleier').subscribe((response) => {

        this.utleie = response;
        if (!this.utleie.rig_gjest) {
          this.utleie.rig_gjest = '';
          this.utleie.rig_gjest = JSON.parse('{"id":"", "kunde_id": "", "navn": "","kommentar":"", rig_kunde": { "id":"" , "navn": "", "prefiks": ""}}');
        }
        //    console.log(this.utleie);

      },
        (error) => {
          this.feilmelding = error.code + ' ' + error.error;

        }
      );
    }
  }

  /*
  slettRessurs(id) {

    return this.http.delete(this.lister.reqstring + 'riggutleier/' + id,
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


  slett(form) {
    const r = confirm('Følgende utleie slettes: \nUtleid til: ' + form.utleid_til
      + '\nFra dato til: ' + form.fra_dato
      + '\nTil dato til: ' + form.til_dato);
    if (r === true) {
      //      this.slettRessurs(form.id).subscribe((response) => {
      this.dss.slett(form.id, 'riggutleier').subscribe((response) => {
        this.resetDisplay(new Date(this.aar, this.maaned, 1));
      },
        (error) => {

        }
      );

    } else {
      //  txt = 'You pressed Cancel!';
    }
  }


  lagre(id, kommentar) {


    // this.utleie.utleid_til = id.value;
    this.utleie.rig_gjest_id = id.value;
    this.utleie.kommentar = kommentar.value;

    if (this.utleie.fra_dato instanceof Date) {
      this.utleie.fra_dato = this.utleie.fra_dato.getFullYear() + '-' + (this.utleie.fra_dato.getMonth() + 1) + '-' + this.utleie.fra_dato.getDate();
    }

    if (this.utleie.til_dato instanceof Date) {
      this.utleie.til_dato = this.utleie.til_dato.getFullYear() + '-' + (this.utleie.til_dato.getMonth() + 1) + '-' + this.utleie.til_dato.getDate();
    }



    if (this.utleie.id === 'ny') {

      //riggutleier

      //      this.newRigutleie(this.utleie).subscribe((response) => {
      this.dss.ny(this.utleie, 'riggutleier').subscribe((response) => {


        this.resetDisplay(new Date(this.aar, this.maaned, 1));
      },
        (error) => {
          this.feilmelding = error.code + ' ' + error.error;
        }
      );
    } else {


      // this.updateRigutleie(this.utleie).subscribe((response) => {

      this.dss.set(this.utleie, 'riggutleier').subscribe((response) => {
        this.resetDisplay(new Date(this.aar, this.maaned, 1));
      },
        (error) => {
        }
      );
    }
  }



  avbryt() {
    this.utleie = {};
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

  getDaysInMonth(month, year) {
    return new Date(year, (month + 1), 0).getDate();
  }



  resetDisplay(dato) {
    this.aar = dato.getFullYear();
    this.maaned = dato.getMonth();
    this.antallDagerImaaned = this.getDaysInMonth(this.maaned, this.aar);
    this.kolonner = (this.antallDagerImaaned + 1) * 2;
    this.utleie = null;
    this.riggene = [];
    this.tileveggen = [];
    this.getRiggOgUtleier((this.maaned + 1), this.aar).subscribe(

      (rec: any[]) => {
        for (let i = 0; i < rec.length; i++) {
          for (let x = 0; x < rec[i].rigutleier.length; x++) {
            if (rec[i].rigutleier[x].spenn === 'foer') {
              const tmp = rec[i].rigutleier[x];
              rec[i].rigutleier.splice(x, 1);
              rec[i].rigutleier.unshift(tmp);
            }
          }
        }

        this.riggene = rec;
        for (let i = 0; i < this.riggene.length; i++) {

          this.tileveggen.push({ text: this.riggene[i].navn, cols: 2, rows: 1, color: '#e9e1e1', date: (i + 1) });
          for (let step = 0; step < this.antallDagerImaaned; step++) { // LEGGER INN TILE
            // Sjekker om rig er utleid på datoen for denne "tile'n"
            // dersom det er to leier med start dato den første, er den ene fra forrige måned og slutter den første i denne måneden
            // den må i så fall legges inn aller først med en halv tile
            let sammeStartDatoPaaToleier = 0;
            let leienSomSkalStarteMnd: any;
            if (step < 1) {
              for (let x = 0; x < this.riggene[i].rigutleier.length; x++) {
                if (Number(this.riggene[i].rigutleier[x].fra_dato.substring(8, 10)) == 1) {
                  if (this.riggene[i].rigutleier[x].id === 901) {
                    //    console.log('sammeStartDatoPaaToleier' + JSON.stringify(this.riggene[i].rigutleier[x])); 
                  }

                  sammeStartDatoPaaToleier++;
                  if (Number(this.riggene[i].rigutleier[x].til_dato.substring(8, 10)) == 1) {
                    leienSomSkalStarteMnd = this.riggene[i].rigutleier[x];
                  }
                }
              }
            }



            if (sammeStartDatoPaaToleier > 1) {
              if (leienSomSkalStarteMnd.id === undefined) {
                this.tileveggen.push(this.utleieTile(leienSomSkalStarteMnd, 1, '#6ab552'));
              }
            }



            let utleid = false;
            for (let x = 0; x < this.riggene[i].rigutleier.length; x++) {




              if (this.riggene[i].rigutleier[x].id == '889' || this.riggene[i].rigutleier[x].id == '832') {
                //                console.log('***' + this.riggene[i].rigutleier[x].id + '**' + Number(step + 1) + '***' + Number(this.riggene[i].rigutleier[x].fra_dato.substring(8, 10)) + '********');
              }

              // Dersom den er utleid denne datoen må vi endre tiles lengde og farge:
              if (Number(step + 1) === Number(this.riggene[i].rigutleier[x].fra_dato.substring(8, 10))) {


                utleid = true;
                let forrigeLeieSlutt = 0;
                let denneLeieStart = 0;
                let denneLeieSlutt = 0;
                let nesteLeieStart = 0;

                // 899 kommer aldri inn her


                switch (this.riggene[i].rigutleier[x].spenn) {
                  case 'etter': {// Leien slutter etter denne månede

                    // dersom det finnes en utleie for denne riggen før denne....
                    if (this.riggene[i].rigutleier[x - 1] !== undefined) {
                      forrigeLeieSlutt = Number(this.riggene[i].rigutleier[x - 1].til_dato.substring(8, 10));
                      denneLeieStart = Number(this.riggene[i].rigutleier[x].fra_dato.substring(8, 10));
                    }
                    if (!(forrigeLeieSlutt === denneLeieStart && denneLeieStart !== 0)) {
                      this.tileveggen.push(this.halvTile((step + 1), this.riggene[i]));
                    }
                    // deretter legger vi inn en tile som strekker seg over antall leiedager

                    const antallLeiedager = (Number(this.riggene[i].rigutleier[x].til_dato.substring(8, 10)) - Number(this.riggene[i].rigutleier[x].fra_dato.substring(8, 10)));
                    step = step + (antallLeiedager); // Skip dager
                    this.tileveggen.push(this.utleieTile(this.riggene[i].rigutleier[x], (antallLeiedager * 2) + 1, '#6ab552'));
                    break;
                  }
                  case 'foer': {// Leien starter før denne månede
                    if (this.riggene[i].rigutleier[x + 1] !== undefined) {
                      nesteLeieStart = Number(this.riggene[i].rigutleier[x + 1].fra_dato.substring(8, 10)); // this.riggene[i].rigutleier[x + 1].fra_dato.substring(8, 10);
                      denneLeieSlutt = Number(this.riggene[i].rigutleier[x].til_dato.substring(8, 10));
                    }








                    // deretter legger vi inn en tile som strekker seg over antall leiedager
                    const antallLeiedager = (Number(this.riggene[i].rigutleier[x].til_dato.substring(8, 10)) - Number(this.riggene[i].rigutleier[x].fra_dato.substring(8, 10)));



                    step = step + (antallLeiedager); // Skip dager
                    this.tileveggen.push(this.utleieTile(this.riggene[i].rigutleier[x], (antallLeiedager * 2) + 1, '#6ab552'));
                    // dersom denne leien IKKE slutter samtidig som  neste leie starter legger vi inne en halv dag i tileveggen
                    if (!(denneLeieSlutt === nesteLeieStart && nesteLeieStart !== 0)) {
                      this.tileveggen.push(this.halvTile((step + 1), this.riggene[i]));
                    }

                    //   this.resetDisplay(new Date(this.aar, this.maaned + 1, 1));
                    break;
                  }
                  case 'foer_etter': { // Leien starter før og slutter  etter denne månede
                    // deretter legger vi inn en tile som strekker seg over antall leiedager
                    const antallLeiedager = (Number(this.riggene[i].rigutleier[x].til_dato.substring(8, 10)) - Number(this.riggene[i].rigutleier[x].fra_dato.substring(8, 10)));
                    step = step + (antallLeiedager); // Skip dager
                    this.tileveggen.push(this.utleieTile(this.riggene[i].rigutleier[x], (antallLeiedager * 2) + 2, '#6ab552'));
                    // dersom denne leien IKKE slutter samtidig som  neste leie starter legger vi inne en halv dag i tileveggen
                    break;
                  }
                  default: { // leien er innenfor denne månden

          
                    // dersom det finnes en utleie for denne riggen etter denne....
                    if (this.riggene[i].rigutleier[x + 1] !== undefined) {
                      nesteLeieStart = Number(this.riggene[i].rigutleier[x + 1].fra_dato.substring(8, 10)); // this.riggene[i].rigutleier[x + 1].fra_dato.substring(8, 10);
                      denneLeieSlutt = Number(this.riggene[i].rigutleier[x].til_dato.substring(8, 10));
                    }
                    // dersom det finnes en utleie for denne riggen før denne....
                    if (this.riggene[i].rigutleier[x - 1] !== undefined) {
                      forrigeLeieSlutt = Number(this.riggene[i].rigutleier[x - 1].til_dato.substring(8, 10));
                      denneLeieStart = Number(this.riggene[i].rigutleier[x].fra_dato.substring(8, 10));
                    }


                    if (!(forrigeLeieSlutt === denneLeieStart && denneLeieStart !== 0)) {
                      if (!(sammeStartDatoPaaToleier > 1)) {
                        this.tileveggen.push(this.halvTile((step + 1), this.riggene[i])); // om den ikke er butt i butt med forrige leie begynner vi med en tom halv tile
                      }
                    }

                    // deretter legger vi inn en tile som strekker seg over antall leiedager
                    const antallLeiedager = (Number(this.riggene[i].rigutleier[x].til_dato.substring(8, 10)) - Number(this.riggene[i].rigutleier[x].fra_dato.substring(8, 10)));
                    step = step + (antallLeiedager); // Skip dager
                    this.tileveggen.push(this.utleieTile(this.riggene[i].rigutleier[x], antallLeiedager * 2, '#6ab552'));
                    // dersom denne leien IKKE slutter samtidig som  neste leie starter legger vi inne en halv dag i tileveggen
                    if (!(denneLeieSlutt === nesteLeieStart && nesteLeieStart !== 0)) {
                      this.tileveggen.push(this.halvTile((step + 1), this.riggene[i]));
                    }
                    break;
                  }
                }
              }










            }
            if (!utleid) {
              this.tileveggen.push(this.helTile((step + 1), this.riggene[i]));
            }
          } // FERDIG MED Å LEGGE INN TILE'N





          ////////////////////////////////////////////////////////////////////////////////////////////

        }
      }


    );

    this.datoer1 = [];
    this.datoer1.push({ text: '', cols: 2, rows: 1, color: '#e9e1e1' });
    // this.setMaanedsnavn();
    for (let step = 0; step < this.antallDagerImaaned; step++) {
      this.datoer1.push({ text: '' + (step + 1) + '.', cols: 2, rows: 1, color: '#e7ecf5' });//3986ba
    }
  }

  utleieTile(utleie, kolonner, farge) {

    if (utleie.rig_gjest_id === '418') {
      farge = '#f59e9e';
    }
    if (utleie.rig_gjest_id === '419') {
      farge = '#ababab';
    }

    //  farge = '#ababab';

    const datoen = utleie.fra_dato.substring(8, 10);
    const utleidTil = utleie.utleid_til;
    const id = utleie.id;
    const rig_id = utleie.rig_id;
    const utleid_til = utleie.utleid_til;
    const halv_tile = false;


    return {
      text: utleidTil, // Kun for display
      cols: kolonner, // Kun for display
      rows: 1, // Kun for display
      color: farge, // Kun for display
      date: datoen,  // Kun for display
      mnd: this.maaned,  // Kun for display
      aar: this.aar,  // Kun for display
      id: id,
      rig_id: rig_id,
      utleid_til: utleidTil,
      fra_dato: this.aar + '-' + (this.maaned + 1) + '-' + datoen,
      til_dato: this.aar + '-' + (this.maaned + 1) + '-' + datoen,
    };
  }


  helTile(datoen, rig) {

    if (datoen.length === 1) {
      datoen = '0' + datoen;
    }
    const til_dato_date = new Date(this.aar + '-' + (this.maaned + 1) + '-' + datoen);
    til_dato_date.setDate(til_dato_date.getDate() + 1);
    const ms = new Date(this.aar + '-' + (this.maaned + 1) + '-' + datoen).getTime() + 86400000;
    const tomorrow = new Date(ms);
    const til_dato = tomorrow.getFullYear() + '-' + (tomorrow.getMonth() + 1) + '-' + (tomorrow.getDate());
    let farge = '#83afcd';
    if (rig.rengjort !== 'Ja') {
      farge = '#ababab';
    }
    if (rig.navn === 'A1') {
      farge = '#91f0d6';
    }

    return {

      text: '', // Kun for display
      cols: 2, // Kun for display
      rows: 1, // Kun for display
      color: farge, // Kun for display
      date: datoen,  // Kun for display
      mnd: this.maaned,  // Kun for display
      aar: this.aar,  // Kun for display
      id: 'ny',
      rig_id: rig.id,
      utleid_til: '',
      fra_dato: this.aar + '-' + (this.maaned + 1) + '-' + datoen,
      til_dato: til_dato, // til_dato_date.getFullYear() + '-' + (til_dato_date.getMonth() + 1) + '-' + (til_dato_date.getDate() + 1 ),
    };
  }




  halvTile(datoen, rig) {
    if (datoen.length === 1) {
      datoen = '0' + datoen;
    }
    const til_dato_date = new Date(this.aar + '-' + (this.maaned + 1) + '-' + datoen);
    til_dato_date.setDate(til_dato_date.getDate() + 1);
    const ms = new Date(this.aar + '-' + (this.maaned + 1) + '-' + datoen).getTime() + 86400000;
    const tomorrow = new Date(ms);
    const til_dato = tomorrow.getFullYear() + '-' + (tomorrow.getMonth() + 1) + '-' + (tomorrow.getDate());
    let farge = '#83afcd';

    if (rig.rengjort !== 'Ja') {
      farge = '#ababab';
    }

    return {
      text: '', // Kun for display
      cols: 1, // Kun for display
      rows: 1, // Kun for display
      color: farge, // Kun for display
      date: datoen,  // Kun for display
      mnd: this.maaned,  // Kun for display
      aar: this.aar,  // Kun for display
      id: 'ny',
      rig_id: rig.id,
      utleid_til: '',
      fra_dato: this.aar + '-' + (this.maaned + 1) + '-' + datoen,
      til_dato: til_dato, // til_dato_date.getFullYear() + '-' + (til_dato_date.getMonth() + 1) + '-' + (til_dato_date.getDate() + 1 ),

    };
  }



  getRiggOgUtleier(mnd, aar) {
    return this.http.get(this.lister.reqstring + 'riggogutleier/' + mnd + '/' + aar, this.authService.getOpts())
      .map(response => {
        return response.json().data;
      }).catch(
        (error: Response) => {
          this.dss.feilmelding(error.json(),'riggogutleier');
         // alert(JSON.stringify(error.json()));
          return Observable.throw(error.json());
        }
      );
  }
}


