import { Logo } from './../../services/logo';
import * as jsPDF from 'jspdf';

import { DataStorageService } from './../../services/data-storage.service';
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
import { AuthService } from './../../signin/auth.service';
import { Lister } from '../../services/lister';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-kandidat',
  templateUrl: './kandidat.component.html',
  styleUrls: ['./kandidat.component.css'],
  providers: [
    { provide: 'Window', useValue: window }
  ]
})
export class KandidatComponent implements OnInit, OnChanges {

  @Input() objekt: any;
  @Output() objektEndret: EventEmitter<any> = new EventEmitter();
  //  @ViewChild('form') signupForm: NgForm;



  testForm: FormGroup; // A form is just a group of controls

  constructor(
    private http: Http,
    private authService: AuthService,
    private lister: Lister,
    private logo: Logo,
    public sanitizer: DomSanitizer,
    public dss: DataStorageService,
    @Inject('Window') private window: Window,
  ) { }

  ngOnInit() {
    this.testForm = new FormGroup({
      id: new FormControl(null),
      fornavn: new FormControl(null, Validators.required),
      etternavn: new FormControl(null, Validators.required),
      adresse: new FormControl(null),
      poststed: new FormControl(null),
      postnummer: new FormControl(null),
      fodselsaar: new FormControl(null, Validators.required),
      mail: new FormControl(null),
      telefon: new FormControl(null),
      image_id: new FormControl(null),
      nasjonalitet: new FormControl(null, Validators.required),
      flyplass: new FormControl(null, Validators.required),
      cv_poster: new FormControl(null),
      primaerkompetanse: new FormControl(null, Validators.required),
      dawinci: new FormControl(null, Validators.required),
    });


  }


  leggTilCvElement() {
    if (this.objekt.cv_poster === undefined) {
      this.objekt.cv_poster = [];
    }
    const resultArray = this.objekt.cv_poster.filter(function (item) {
      return item['id'] === 'ny';
    });
    if (resultArray.length === 1) {
    } else {
      const nyttCVElement = {
        id: 'ny',
        arbeidsgiver: '',
        arrangor: '',
        beskrivelse: '',
        fra_dato: '',
        til_dato: '',
        kandidat_id: this.objekt.id,
        image_id: null,
        tittel: '',
        type_post: '',
        primaerkompetanse: '',
        dawinci: '',
      };
      this.objekt.cv_poster.push(nyttCVElement);
    }
  }


  cvEndring(inn) {
    if (inn.slett) {
      this.objekt.cv_poster.splice(this.objekt.cv_poster.indexOf(inn.slett), 1);
    }
    if (inn.rediger) {
      delete inn.rediger;
      for (let i = 0; i < this.objekt.cv_poster.length; i++) {
        if (this.objekt.cv_poster[i].id === inn.id) {
          this.objekt.cv_poster[i] = inn;
        }
      }
    }
    this.objektEndret.emit('');

  }


  billedstorrelse = 35;

  ngOnChanges(changes: SimpleChanges) {

    if (this.objekt) {
      this.testForm.setValue(this.objekt);
      if (this.objekt.image_id) {
        this.dss.get(this.objekt.image_id, 'images')
          .subscribe((img) => {
            this.myImage = 'data:image/jpeg;base64,' + img.image;
            this.index = Math.trunc(((Number(img.width) / Number(img.height)) * this.billedstorrelse));
          },
            (error) => {
              console.log('Feil: Fant ikke bilde som skal ligge på cv');
            }
          );
      }
    }
  }


  avbryt(form) {
    let control: AbstractControl = null;
    this.testForm.reset();
    this.testForm.markAsUntouched();
    Object.keys(this.testForm.controls).forEach((name) => {
      control = this.testForm.controls[name];
      control.setErrors(null);
    });
    this.objekt = null;
  }



  bildeErLagtInn(element) {
    if (element.nytt_image) {
      const obj: any = { id: this.objekt.id, image_id: element.nytt_image };
      this.dss.set(obj, 'kandidater').subscribe((response) => {
        this.testForm.setValue(response);
        this.dss.get(element.nytt_image, 'images')
          .subscribe((img) => {
            this.myImage = 'data:image/jpeg;base64,' + img.image;
            this.index = Math.trunc(((Number(img.width) / Number(img.height)) * this.billedstorrelse));
            this.red();
          },
            (error) => {
              console.log('Feil: Fant ikke bilde til cv-utskrift');
            }
          );
      },
        (error) => {
        }
      );
    }
    if (element.slett_image) {
      this.objekt.image_id = null;
      const obj: any = { id: this.objekt.id, image_id: 'slett' };
      this.dss.set(obj, 'kandidater').subscribe((response) => {
        this.testForm.setValue(this.objekt);
      },
        (error) => {
        }
      );
    }
    if (element.rediger_image) {
      this.dss.get(element.rediger_image, 'images')
        .subscribe((img) => {
          this.myImage = 'data:image/jpeg;base64,' + img.image;
          this.index = Math.trunc(((Number(img.width) / Number(img.height)) * this.billedstorrelse));
          this.red();
        },
          (error) => {
          }
        );

    }

  }



  red() {
    delete this.testForm.value.image_id;
    if (this.testForm.value.id === 'ny') {
      this.dss.ny(this.testForm.value, 'kandidater').subscribe((res) => {
        this.testForm.value.id = this.objekt.id = res.id;
        this.objektEndret.emit(res);
      }, (error) => {
        console.log(error.code + ' ' + error.error);
      });
      this.objektEndret.emit(this.testForm.value);
    } else {
      this.dss.set(this.testForm.value, 'kandidater').subscribe((response) => {
        this.objektEndret.emit(response);
        this.testForm.setValue(response);
      }, (error) => {
        });
    }
  }


  slett() {
    const r = confirm('Følgende kandidat slettes: \nForavn: ' + this.testForm.value.fornavn + '\nEtternavn: ' + this.testForm.value.etternavn);
    if (r === true) {
      this.dss.slett(this.testForm.value.id, 'kandidater').subscribe((response) => {
        this.objektEndret.emit(this.testForm.value);
        this.objekt = null;
      },
        (error) => {
        }
      );

    }
  }
  utdanningEndret(inn) { }

  kursEndret(inn) { }



  fyllListeneTilUtskriften(inn_post, data) {
    const list: any[] = [];
    for (let i = 0; i < data.cv_poster.length; i++) {
      if (data.cv_poster[i].utskrift === 'ja') {
        if (data.cv_poster[i].type_post === inn_post) {
          list.push(data.cv_poster[i]);
        }
      }
    }
    return list;
  }

  logoImage;
  index;
  myImage;
  download() {
    this.logoImage = 'data:image/jpeg;base64,' + this.logo.logo.image;
    this.dss.get(this.objekt.id, 'kandidater')
      .subscribe((data) => {
        const doc = new jsPDF();
        const logostorrelse = 20;
        const skrift = 12;
        const fradatoMotVenstre = 42;
        const beskrivelseMotVenstre = 80;
        let logoIndex = (Number(this.logo.logo.width) / Number(this.logo.logo.height));

        logoIndex = (logoIndex * logostorrelse);
        logoIndex = Math.trunc(logoIndex);

        doc.setDrawColor(0, 61, 122); //MØRK
        doc.setLineWidth(0.1);
        doc.line(186, 55, 186, 290); // vertical line

        doc.setDrawColor(133, 175, 204); // LYS
        doc.setLineWidth(0.5);
        doc.line(188, 55, 188, 290);

        doc.setDrawColor(105, 181, 88); // GRØNN
        doc.setLineWidth(1);
        doc.line(190, 55, 190, 290);

        doc.setFontSize(23);

        doc.text(20, 40, 'Curriculum Vitae');
        doc.addImage(this.logoImage, 'JPG', 140, 15, logoIndex, logostorrelse);

        if (this.objekt.image_id) {

          doc.addImage(this.myImage, 'JPG', 140, 40, this.index, this.billedstorrelse);
        }

        doc.setFontSize(12);
        doc.text(20, 50, 'Navn: ' + data.fornavn + ' ' + data.etternavn);
        doc.text(20, 57, 'Fødselsår: ' + data.fodselsaar);
        doc.text(20, 64, 'Primærkompetanse: ' + data.primaerkompetanse);
        doc.text(20, 71, 'Nasjonalitet: ' + data.nasjonalitet);

        let nedover = 105;

        const utdanning: any[] = this.fyllListeneTilUtskriften('utdanning', data);
        const kurs: any[] = [] = this.fyllListeneTilUtskriften('kurs', data);
        const erfaring: any[] = this.fyllListeneTilUtskriften('erfaring', data);
        const attest: any[] = this.fyllListeneTilUtskriften('attest', data);


        nedover = this.setOppPoster(utdanning, nedover, 'Utdanning:', doc, skrift, fradatoMotVenstre, beskrivelseMotVenstre);
        nedover = this.setOppPoster(kurs, nedover, 'Kurs:', doc, skrift, fradatoMotVenstre, beskrivelseMotVenstre);
        nedover = this.setOppPoster(erfaring, nedover, 'Erfaring:', doc, skrift, fradatoMotVenstre, beskrivelseMotVenstre);
        nedover = this.setOppPoster(attest, nedover, 'Attester:', doc, skrift, fradatoMotVenstre, beskrivelseMotVenstre);

        doc.setTextColor(100);
        doc.setTextColor(100);
        doc.save(this.objekt.fornavn + '-' + this.objekt.etternavn + '.pdf');

      },
        (error) => {
        }
      );
  }

  sideskift(doc, avsnitt) {
    doc.addPage();
    doc.text(10, 5, 'CV: ' + this.objekt.fornavn + ' ' + this.objekt.etternavn + ' ' + avsnitt);
    doc.addImage(this.logoImage, 'JPG', 165, 2, 41, 15); //62----------20
    doc.setDrawColor(0, 61, 122); //MØRK
    doc.setLineWidth(0.1);
    doc.line(186, 18, 186, 290); // vertical line
    doc.setDrawColor(133, 175, 204); // LYS
    doc.setLineWidth(0.5);
    doc.line(188, 18, 188, 290);
    doc.setDrawColor(105, 181, 88); // GRØNN
    doc.setLineWidth(1);
    doc.line(190, 18, 190, 290);
  }


  setOppPoster(utdanning, nedover, type_post, doc, skrift, fradatoMotVenstre, beskrivelseMotVenstre) {
    //let nedover;

    doc.setFontSize(16);

    if (utdanning.length > 0) {
      doc.text(20, nedover, type_post);

      for (let i = 0; i < utdanning.length; i++) {
        doc.setFontSize(skrift);


        if (nedover > 270) {
          nedover = 10;
          nedover = nedover + 10;
          this.sideskift(doc, type_post + ' (forts):');
        }


        nedover = nedover + 7;
        if (utdanning[i].fra_dato !== null) { doc.text(20, nedover, utdanning[i].fra_dato); }
        if (utdanning[i].til_dato !== null) { doc.text(fradatoMotVenstre, nedover, ' - ' + utdanning[i].til_dato); }
        if (utdanning[i].beskrivelse !== null) { doc.text(beskrivelseMotVenstre, nedover, utdanning[i].beskrivelse); }
      }

      nedover = nedover + 15;
    }
    return nedover;
  }


}
