// tslint:disable:comment-format
// tslint:disable:member-ordering
// tslint:disable:max-line-length

import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AbstractControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Injectable, EventEmitter } from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { element } from 'protractor';
@Component({
  selector: 'app-utdanning',
  templateUrl: './utdanning.component.html',
  styleUrls: ['./utdanning.component.css']
})
export class UtdanningComponent implements OnInit {
  @Input() kandidat: any;
  
  constructor() { }

  ngOnInit() { }


  vise(elementet) {
    if (elementet['type_post'] !== 'utdanning') {
      return 'none';
    }
  }


  //beskrivelse, fra_dato, til_dato
  cvEndring(e) {
    console.log('Noe ble enderet (Linje 52 utdanning.component.ts)');
    console.log('Fikk inn dette:');
    console.log(JSON.stringify(e));

    if (e.slett) {

      for (let i = 0; i < this.kandidat.cv_poster.length; i++) {
        if (this.kandidat.cv_poster[i].id === e.slett) {
          this.kandidat.cv_poster.splice(this.kandidat.cv_poster.indexOf(this.kandidat.cv_poster[i]), 1);
        }
      }
    }

    if (e.nytt) {
      for (let i = 0; i < this.kandidat.cv_poster.length; i++) {
        if (!this.kandidat.cv_poster[i].id) {
          this.kandidat.cv_poster[i].id = e.nytt.id;
        }
      }
    }
  }


  leggTilElement() {
    let ny = false;
    for (let i = 0; i < this.kandidat.cv_poster.length; i++) {
      if (this.kandidat.cv_poster[i].id === 'ny') {
        ny = true;
      }
    }

    if (!ny) {
      const nyttCVElement = {
        id: 'ny',
        beskrivelse: '',
        fra_dato: '',
        til_dato: '',
        kandidat_id: this.kandidat.id,
        type_post: 'utdanning',
      };
      this.kandidat.cv_poster.unshift(nyttCVElement);
    }

  }
}


