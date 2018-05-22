// tslint:disable:member-ordering
// tslint:disable:max-line-length

import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { DataStorageService } from '../../services/data-storage.service';


@Component({
  selector: 'app-utlaan',
  templateUrl: './utlaan.component.html',
  styleUrls: ['./utlaan.component.css']
})
export class UtlaanComponent implements OnInit {
  verktoy: any;
  prosjekt: any;
  prosjektnavn = 'test';
  lagerliste;


  constructor(private dss: DataStorageService) { }
  ngOnInit() { }

  settVerktoy(row) {
    this.verktoy = row;
  }

  settProsjekt(row) {
    this.dss.get(row.id, 'prosjekter_verktoy')
      .subscribe((data) => {
        this.prosjekt = data;
        this.redigerProsjekt = false;

      },
        (error) => {
          console.log(error);
        }
      );

  }


  slettProsjekt() {
    const r = confirm('Prosjektet slettes og alle verktøy i \ndenne listen legges tilbake til lager');
    if (r === true) {
      this.dss.slett(this.prosjekt.id, 'prosjekter').subscribe((response) => {
        this.dss.getIndex('verktoy_lager').subscribe((res) => {
          this.lagerliste = res;

          this.prosjekt = null;
          this.redigerProsjekt = false;


          this.dss.getIndex('prosjekter').subscribe(
            (rec: any[]) => {
              this.prosjektliste = rec;

            }
          );


        }, (error) => {
          console.log(error.code + ' LINJE 50 ' + error.error);
        }
        );

      },
        (error) => {
          const feilmelding = error.code + ' ' + error.error;
          console.log(feilmelding);
        }
      );
    }
  }


  leverTilLager(e) {
    this.dss.getIndex('verktoy_lager').subscribe((response) => {
      this.lagerliste = response;
    }, (error) => {
      console.log(error.code + ' LINJE 52 ' + error.error);
    }
    );
  }



  leggInnVerktoyPaaProsjekt(e) {

    if (!this.prosjekt) {
      alert('Du må velge prosjektet verktøyet skal legges inn på');
    } else if (this.prosjekt.id === 'ny') {

      alert('Du må lagre prosjektet før verktøyet kan legges inn');

    } else {

      const obj: any = { id: e.id, tilgjengelig: 'utleid', prosjekt_id: this.prosjekt.id };
      this.dss.set(obj, 'verktoy').subscribe((response) => {
        this.dss.get(this.prosjekt.id, 'prosjekter_verktoy')
          .subscribe((data) => {
            this.prosjekt = data;
          },
            (error) => {
              console.log(error);
            }
          );
      }, (error) => {
        console.log(error.code + ' LINJE 73 ' + error.error);
      }
      );
    }
  }

  nyttProsjekt() {
    const obj: any = { id: 'ny' };
    this.prosjekt = obj;
  }

  prosjektliste;
  lagreNyttProsjekt(navn, nummer) {
    const obj: any = { prosjektnavn: navn, prosjekt_id: nummer };
    this.dss.ny(obj, 'prosjekter').subscribe((response) => {
      this.prosjekt = response;

      this.dss.getIndex('prosjekter').subscribe(
        (rec: any[]) => {
          this.prosjektliste = rec;

        }
      );
    }, (error) => {
      console.log(error.code + ' LINJE 73 ' + error.error);
    }
    );
  }

  avbrytNyttProsjekt() {
    this.prosjekt = null;
    this.redigerProsjekt = false;
  }

  avbrytRedigerProsjekt() {
    this.redigerProsjekt = false;
  }

  redigerProsjekt = false;

  onRedigerProsjekt(navn, nummer) {
    this.redigerProsjekt = true;
  }

  saveProsjekt(navn, nummer) {
    const obj: any = { id: this.prosjekt.id, prosjektnavn: navn, prosjekt_id: nummer };
    this.dss.set(obj, 'prosjekter').subscribe((response) => {
      this.prosjekt = response;
      this.dss.getIndex('prosjekter').subscribe(
        (rec: any[]) => {
          this.prosjektliste = rec;
        }
      );
      this.redigerProsjekt = false;

    }, (error) => {
      console.log(error.code + ' LINJE 73 ' + error.error);
    }
    );
  }
}