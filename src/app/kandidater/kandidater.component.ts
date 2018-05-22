import { DataStorageService } from './../services/data-storage.service';
import { Component, OnInit, ViewChild, Inject, Output } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
@Component({
  selector: 'app-kandidater',
  templateUrl: './kandidater.component.html',
  styleUrls: ['./kandidater.component.css']
})
export class KandidaterComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  redigerObjekt: any;

  constructor(public dss: DataStorageService) { }

  displayedColumns = ['fornavn', 'etternavn', 'primaerkompetanse', 'flyplass', 'dawinci'];
  dataSource;

  ngOnInit() {
    //  this.authService.getToken();
    this.dss.getIndex('kandidater').subscribe(
      (recipes: any[]) => {
        this.dataSource = new MatTableDataSource<any>(recipes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

      ,
      (error) => {

      }
    );

  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  leggTilNy() {
    this.redigerObjekt = {
      id: 'ny',
      adresse: '',
      cv_poster: [],
      etternavn: '',
      flyplass: '',
      fodselsaar: '',
      fornavn: '',
      image_id: null,
      mail: '',
      nasjonalitet: '',
      postnummer: '',
      poststed: '',
      telefon: '',
      primaerkompetanse: '',
      dawinci: '',
    };
  }


  aapneElement(e) {
    this.redigerObjekt = e;
  }

  redigerObjektEndret(objekt: any) {

    if (objekt.nytt_image) {
      this.redigerObjekt.image_id = objekt.nytt_image;

    } else {


      console.log(objekt);
      this.dss.getIndex('kandidater').subscribe(
        (recipes: any[]) => {
          this.dataSource = new MatTableDataSource<any>(recipes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      );

    }


  }
}
