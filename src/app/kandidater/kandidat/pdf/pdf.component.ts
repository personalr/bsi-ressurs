import { DataStorageService } from './../../../services/data-storage.service';
import { FormGroup } from '@angular/forms';
// tslint:disable:comment-format
// tslint:disable:member-ordering
// tslint:disable:max-line-length

import { ViewChild } from '@angular/core';
import { Component, OnInit, Input, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { AbstractControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
// import { Injectable, EventEmitter } from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {
  @Input() id: any;
  @Input() cv_id: string;
  @Input() type: string;


  private readonly imageType: string = 'data:image/JPG;base64,';
  private readonly pdfType: string = 'data:application/pdf;base64,';


  tekst;
  imagedata: any;
  image: any;
  imagePdf: any;

  constructor(
    public sanitizer: DomSanitizer,
    public dss: DataStorageService,

  ) { }

  ngOnInit() {


    console.log('===========================BURDE IKKE VISES==================================');
    if (this.id) {
      this.tekst = 'photo_library';
      this.dss.get(this.id, 'images')
        .subscribe((data) => {
          this.image = this.sanitizer.bypassSecurityTrustUrl(this.imageType + data.image);
          this.imagePdf = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfType + data.image);
        },
          (error) => {
          }
        );
    } else {
      this.image = '';
      this.tekst = 'add_a_photo';
    }
    this.tekst = 'add_a_photo';
  }


  onFileChange1(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (this.id) {
          const r = confirm('Vil du erstatte eksisterende pdf med den valgte?');
          if (r === true) {
            this.imagedata = reader.result.split(',')[1];
            this.imagePdf = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfType + this.imagedata);
            const obj: any = { id: this.id, image: this.imagedata };
            this.dss.set(obj, 'images').subscribe((response) => {
            }, (error) => {
            });
          }
        } else {
          this.imagedata = reader.result.split(',')[1];
          this.imagePdf = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfType + this.imagedata);
          const obj: any = { image: this.imagedata };
          this.dss.ny(obj, 'images').subscribe((res) => {
            this.id = res.id;
            const nyttCVElement: any = {
              id: this.cv_id,
              image_id: res.id,
            };
            this.dss.set(nyttCVElement, 'cv_poster').subscribe((resu) => {
            }, (error) => {
            }
            );


          }, (error) => {

          }
          );




        }

      };
    }
  }


  slett(form) {
    const r = confirm('Slette pdf dokument?');
    if (r === true) {
      this.dss.slett(this.id, 'images').subscribe((response) => {
        this.image = '';
        this.imagePdf = this.sanitizer.bypassSecurityTrustResourceUrl(null);
        this.tekst = 'add_a_photo';
        delete this.id;

        ////////////////////////// 247
        const nyttCVElement: any = {
          id: this.cv_id,
          image_id: 'ny',
        };
        this.dss.set(nyttCVElement, 'cv_poster').subscribe((resu) => {
        }, (error) => {
        }
        );


      },
        (error) => {
        }
      );
    }
  }
}
