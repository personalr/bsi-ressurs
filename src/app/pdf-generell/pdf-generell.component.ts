// tslint:disable:comment-format
// tslint:disable:member-ordering
// tslint:disable:max-line-length
import { DataStorageService } from './../services/data-storage.service';
import { FormGroup } from '@angular/forms';
import { ViewChild, EventEmitter } from '@angular/core';
import { Component, OnInit, Input, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { AbstractControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-pdf-generell',
  templateUrl: './pdf-generell.component.html',
  styleUrls: ['./pdf-generell.component.css']
})
export class PdfGenerellComponent implements OnInit, OnChanges {

  @Input() objekt: any;
  @Output() pdfEndret: EventEmitter<any> = new EventEmitter();

  //private readonly imageType: string = 'data:image/JPG;base64,';
  private readonly pdfType: string = 'data:application/pdf;base64,';

  tekst;
  undertekst;
  imagedata: any;
  imagePdf: any;
  randomid;
  id;

  constructor(
    public sanitizer: DomSanitizer,
    public dss: DataStorageService,

  ) { }


  ngOnInit() {

    const data = 'some text';
    const blob = new Blob([data], { type: 'application/octet-stream' });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

    console.log('*************************** PDF init ***********************');
    this.setUp();
  }

  name = 'Angular 5';
  fileUrl;




  setUp() {
    if (this.objekt.image_id) {
      this.id = this.objekt.image_id;
      this.tekst = 'photo_library';
      this.undertekst = 'Endre pdf';
      this.dss.get(this.objekt.image_id, 'images')

        //this.dss.downloadPDF(this.objekt.image_id, 'images')
        .subscribe((data) => {

          // const blob = new Blob([data.image], { type: 'application/pdf' });
           this.imagePdf = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfType + data.image);
          // const data = 'some text';
          // const blob = new Blob([data.image], { type: 'application/octet-stream' });

          // const blob = new Blob([data.image], { type: 'application/pdf' });
          // this.imagePdf = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

          // const url = window.URL.createObjectURL(data.image);
          // this.imagePdf = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          // this.showFile(data.image);




        },
          (error) => {
            console.log(error);
          }
        );
    } else {
      this.imagePdf = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfType + '');
      this.tekst = 'add_a_photo';
      this.undertekst = 'Legg inn pdf';
    }
    this.tekst = 'add_a_photo';
    this.randomid = this.makeid();
  }

  makeid() {
    let text = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setUp();
  }

  onFileChange1(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (this.objekt.image_id) {
          const r = confirm('Vil du erstatte eksisterende pdf med den valgte?');
          if (r === true) {
            this.imagedata = reader.result.split(',')[1];
            this.imagePdf = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfType + this.imagedata);

            const obj: any = { id: this.objekt.image_id, image: this.imagedata };
            this.dss.set(obj, 'images').subscribe((response) => {
            }, (error) => {
            });
          }
        } else {
          this.imagedata = reader.result.split(',')[1];
          this.imagePdf = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfType + this.imagedata);
          const obj: any = { image: this.imagedata };
          this.dss.ny(obj, 'images').subscribe((res) => {
            this.objekt.image_id = res.id;
            const nyttImage: any = {
              nytt_image: res.id,
            };

            this.pdfEndret.emit(nyttImage);

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
      this.dss.slett(this.objekt.image_id, 'images').subscribe((response) => {
        this.imagePdf = this.sanitizer.bypassSecurityTrustResourceUrl(null);
        this.tekst = 'add_a_photo';
        delete this.objekt.image_id;
        const nyttImage: any = {
          slett_image: 'test',
        };
        this.pdfEndret.emit(nyttImage);
      },
        (error) => {
        }
      );
    }
  }







  showFile(blob) {
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    const newBlob = new Blob([blob], { type: 'application/pdf' });

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }

    // For other browsers: 
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement('a');
    link.href = data;
    link.download = 'file.pdf';
    link.click();

    setTimeout(function () { window.URL.revokeObjectURL(data); }, 1000);

  }















}





