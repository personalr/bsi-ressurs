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
import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from './../../../signin/auth.service';
import { Lister } from '../../../services/lister';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit, OnChanges {


  @Input() objekt: any;
  @Output() imageEndret: EventEmitter<any> = new EventEmitter();


  private readonly imageType: string = 'data:image/JPG;base64,';



  tekst;
  undertekst;
  blob: any;
  image: any;
  randomid;
  //id;

  constructor(
    public sanitizer: DomSanitizer,
    public dss: DataStorageService,

  ) { }


  ngOnInit() { }



  makeid() {
    let text = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  bildeFinnes: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (this.objekt.image_id) {
      this.bildeFinnes = true;
      this.tekst = 'photo_library';
      this.undertekst = 'Endre bilde';
      this.dss.get(this.objekt.image_id, 'images')
        .subscribe((data) => {

          this.image = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageType + data.image);
        },
        (error) => {
        }
        );
    } else {
      this.bildeFinnes = false;
      this.image = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageType + '');
      this.tekst = 'add_a_photo';
      this.undertekst = 'Legg inn bilde';
    }
    this.tekst = 'add_a_photo';
    this.randomid = this.makeid();
  }





  onFileChange(event) {
    const r = confirm('Vil du lagre det valgte bildet ? ');
    if (r === true) {

      const reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.image = new Image;
          this.blob = reader.result.split(',')[1];
          this.image.src = this.imageType + this.blob; // 'data:image/png;base64,whatever';      

          if (this.objekt.image_id) {
            this.image.onload = () => {
              const obj: any = { id: this.objekt.image_id, image: this.blob, width: this.image.width, height: this.image.height, };
              this.image = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageType + this.blob);
              this.dss.set(obj, 'images').subscribe((response) => {
                this.objekt.image_id = response.id;
                const nyttImage: any = {
                  rediger_image: response.id,
                };

                this.imageEndret.emit(nyttImage);
              }, (error) => {
              });

            }
            //   }
          } else {
            this.image.onload = () => {
              const obj: any = { image: this.blob, width: this.image.width, height: this.image.height, };
              this.image = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageType + this.blob);
              this.dss.ny(obj, 'images').subscribe((res) => {


                this.objekt.image_id = res.id;
                const nyttImage: any = {
                  nytt_image: res.id,
                };


                this.imageEndret.emit(nyttImage);
              }, (error) => {
              }
              );
            }
          }
        };//reader.onload
      }
    }
  }


  slett(form) {
    const r = confirm('Slette bildet?');
    if (r === true) {
      this.dss.slett(this.objekt.image_id, 'images').subscribe((response) => {
        this.image = this.sanitizer.bypassSecurityTrustResourceUrl(null);
        this.tekst = 'add_a_photo';
        delete this.objekt.image_id;
        const nyttImage: any = {
          slett_image: 'test',
        };
        this.imageEndret.emit(nyttImage);
      },
        (error) => {
        }
      );
    }
  }
}