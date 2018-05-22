import { DataStorageService } from './../../../../services/data-storage.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cv-utdanning',
  templateUrl: './cv-utdanning.component.html',
  styleUrls: ['./cv-utdanning.component.css']
})
export class CvUtdanningComponent implements OnInit {
  @Input() objekt: any;
  @Output() cvEndring: EventEmitter<any> = new EventEmitter();
  
  constructor(public dss: DataStorageService, ) { }
  
  ngOnInit() { }

  endrerPdf(element) {
    if (element.nytt_image) {
      this.objekt.image_id = element.nytt_image;
      const obj: any = { id: this.objekt.id, image_id: element.nytt_image };
      this.dss.set(obj, 'cv_poster').subscribe((response) => {
       // this.setUp();
      },
        (error) => {
        }
      );
    }
    if (element.slett_image) {
      console.log('parent registrerer endring: sletter ');
      const obj: any = { id: this.objekt.id, image_id: 'slett' };
      this.dss.set(obj, 'cv_poster').subscribe((response) => {
      },
        (error) => {
        }
      );
    }
  }


  save(beskrivelse, fra_dato, til_dato, utskrift) {
    if (utskrift.checked === true) {
      this.objekt.utskrift = 'ja';
    } else {
      this.objekt.utskrift = 'nei';
    }
    this.objekt.beskrivelse = beskrivelse.value;
    this.objekt.fra_dato = fra_dato.value;
    this.objekt.til_dato = til_dato.value;
    this.red();
  }


  datoValid(e) {
    if (e.trim().length === 0) {
      return true;
    }
    return /^\d{2}\-\d{2}\-\d{4}/.test(e);
  }

  updateStyle(bol) {
    if (bol) {
      return '#f1b1b1';
    }
  }


  red() {
    if (this.objekt.id === 'ny') {
      delete this.objekt.id;
      this.dss.ny(this.objekt, 'cv_poster').subscribe((res) => {
        this.objekt = res;
        const nyttCVElement: any = {
          nytt: this.objekt,
        };
        this.cvEndring.emit(nyttCVElement);
      }, (error) => {
        this.objekt.id = 'ny';
      });
    } else {
      this.dss.set(this.objekt, 'cv_poster').subscribe((response) => {
        console.log(JSON.stringify(this.objekt));
        this.objekt = response;
        const nyttCVElement: any = {
          endret: this.objekt,
        };
      },
        (error) => {
        });
    }
  }


  slett() {
    const r = confirm('Følgende cv-post slettes: \nTittel: ' + this.objekt.tittel + '\nType: ' + this.objekt.beskrivelse);
    if (r === true) {
      if (this.objekt.id !== 'ny') {
        this.dss.slett(this.objekt.id, 'cv_poster').subscribe((response) => {
          const nyttCVElement: any = {
            slett: this.objekt.id,
          };
          this.cvEndring.emit(nyttCVElement);
        },
          (error) => {
          }
        );
      } else {
        const nyttCVElement: any = {
          slett: this.objekt.id,
        };
        this.cvEndring.emit(nyttCVElement);
      }
    }
  }
}
