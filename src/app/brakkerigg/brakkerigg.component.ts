// tslint:disable:member-ordering

import { AuthService } from './../signin/auth.service';
import { Lister } from './../services/lister';
import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-brakkerigg',
  templateUrl: './brakkerigg.component.html',
  styleUrls: ['./brakkerigg.component.css']
})
export class BrakkeriggComponent implements OnInit {

  constructor(private lister: Lister, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getToken();
  }


  utleiekalender = true;
  brakker = false;
  fakturering = false;
  kunder = false;
  gjester = false;

  onOpen(event) {
    switch (event.tab.textLabel) {
      case 'Utleiekalender': {
        this.utleiekalender = true;
        this.brakker = false;
        this.fakturering = false;
        this.kunder = false;
        this.gjester = false;
        break;
      }
      case 'Brakker': {
        this.utleiekalender = false;
        this.brakker = true;
        this.fakturering = false;
        this.kunder = false;
        this.gjester = false;
        break;
      }
      case 'Fakturering': {
        this.utleiekalender = false;
        this.brakker = false;
        this.fakturering = true;
        this.kunder = false;
        this.gjester = false;
        break;
      }


      case 'Kunder': {
        this.utleiekalender = false;
        this.brakker = false;
        this.fakturering = false;
        this.kunder = true;
        this.gjester = false;


        break;
      }


      case 'Gjester': {
        this.utleiekalender = false;
        this.brakker = false;
        this.fakturering = false;
        this.kunder = false;
        this.gjester = true;


        break;
      }

      default: {
        this.utleiekalender = true;
        this.brakker = false;
        this.fakturering = false;
        this.kunder = false;
        this.gjester = false;
        break;
      }
    }


  }
}