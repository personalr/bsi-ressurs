  // tslint:disable:member-ordering
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './../signin/auth.service';

import { Injectable } from '@angular/core';
// import { Http, Response, RequestOptions } from '@angular/http';

import { Response, RequestOptions, Http, Headers } from '@angular/http';
// tslint:disable-next-line:import-blacklist
// import 'rxjs/Rx';


import { Observable } from 'rxjs/Observable';

@Injectable()
export class Lister {
  /* public verifisert = [{ 'id': 0, 'name': 'Ja' }, { 'id': 1, 'name': 'Nei' }]; */


  public cvType = [
    { display: 'Utdanning' },
    { display: 'Kurs' },
    { display: 'Efaring' },
    { display: 'Efaring hos BSI-Offshore' },
  ];

  public admin = [{ 'id': true, 'name': 'Ja' }, { 'id': false, 'name': 'Nei' }];
  public reqstring = 'https://test.rj-web.no/public/';

  public rengjort = [
    { display: 'Ja' },
    { display: 'Nei' },
  ];


  public verktoyGrupper = [
	{ display: 'Alle' },
    { display: '01 Batteri driller' },
    { display: '02 El. driller' },
    { display: '03 Stikksager/ bajonettsager' },
    { display: '04 Sirkelsager' },
    { display: '05 Platesakser / niblere' },
    { display: '06 Vinkelkuttere' },
    { display: '07 Fugespistoler' },
    { display: '08 Kango og borhammere' },


    { display: '09 Sveiseapparater/boltepistoler' },
    { display: '10 Betongblandere' },
    { display: '11 Støvsugere' },
    { display: '12 Varmeovner og vifter' },
    { display: '13 Arbeidslamper og slanger' },
    { display: '14 Gulvlegger og fliseutstyr' },
    { display: '15 Stiger og trøer' },

    { display: '16 Div. elektroverktøy' },
    { display: '17 Håndverktøy' },
  ];



  public status = [
    { display: 'ledig' },
    { display: 'utleid' },
    { display: 'defekt' },
  ];



  public maanedsliste: any[] = [
    { navn: 'januar', nr: 0 },
    { navn: 'februar', nr: 1 },
    { navn: 'mars', nr: 2 },
    { navn: 'april', nr: 3 },
    { navn: 'mai', nr: 4 },
    { navn: 'juni', nr: 5 },
    { navn: 'juli', nr: 6 },
    { navn: 'august', nr: 7 },
    { navn: 'september', nr: 8 },
    { navn: 'oktober', nr: 9 },
    { navn: 'november', nr: 10 },
    { navn: 'desember', nr: 11 },

  ];












  











skrivUtPlukkliste(object) {


  //  console.log(JSON.stringify(object));


  const utlevert_av = object.utlevert_av;
  const utlevert_til = object.utlevert_til;
  const innlevert_til = object.innlevert_til;
  const innlevert_av = object.innlevert_av;



  const vNavn = '50mm';
  const vIdnr = '18mm';
  const vType = '17mm';
  const vReol = '12mm';
  const vHylle = '12mm';
  const vPlass = '12mm';
  const vAvsjekk = '10mm';


  let totaltAntallSider = 1;
  if (object.verktoyutleier.length < 16) { totaltAntallSider = 1; }


  if (object.verktoyutleier.length >= 16 && object.verktoyutleier.length < 40) { totaltAntallSider = 2; }
  if (object.verktoyutleier.length >= 40 && object.verktoyutleier.length < 64) { totaltAntallSider = 3; }
  if (object.verktoyutleier.length >= 64 && object.verktoyutleier.length < 90) { totaltAntallSider = 4; }
  if (object.verktoyutleier.length >= 90 && object.verktoyutleier.length < 114) { totaltAntallSider = 5; }

  const mywindow = window.open('', 'PRINT');

  mywindow.document.write('<html xmlns="http://www.w3.org/1999/xhtml"><head><style>');
  mywindow.document.write('.skjerm {display: block;}');
  mywindow.document.write('.utskrift {display: none;}');
  mywindow.document.write('@page{size: auto;  margin: 0 20mm 0 20mm;}');
  mywindow.document.write(' @media print {h1{font-size: 8mm;}');
  mywindow.document.write('  .skjerm {display: none;}');
  mywindow.document.write('.utskrift {display: block;}');
  mywindow.document.write('  table {font-size: 5mm;}');
  mywindow.document.write('  td {width: 100%;text-align: left;');
  mywindow.document.write('padding-left:3mm; height:12.9mm;white-space: nowrap;overflow: hidden; border:solid white}}');
  mywindow.document.write('</style></head><body class="utskrift">');

  mywindow.document.write('<div style=" display: flex; padding: 10mm" >');
  mywindow.document.write('<img  style="padding: 0;height: 6.2vw;width: auto;" src="assets/img/BSI-OFFSHORE-LOGO-VEKTOR.svg">');
  mywindow.document.write('<h1 style=" padding-left: 3cm;">Utlånsliste</h1>');
  mywindow.document.write('</div>');
  const vDato = '75mm';
  const vDatoStyle = 'style="min-width: ' + vDato + '; max-width: ' + vDato + ';"';
  const vTotaltAntallSiderStyle = 'style="min-width: ' + vDato + '; max-width: ' + vDato + '; text-align: right;"';

  mywindow.document.write('<table><tr style="font-weight:bold">');
  mywindow.document.write('<td ' + vDatoStyle + '">Dato for utlevering: ' + object.fra_dato + '</td>');
  mywindow.document.write('<td ' + vDatoStyle + '"> Utlånsnummer: ' + object.plukkliste_id + '</td>');
  mywindow.document.write('<td ' + vTotaltAntallSiderStyle + '> Side 1/' + totaltAntallSider + '</td></tr></table>');


  const pidn = '35mm';

  // tslint:disable-next-line:max-line-length
  const vProsjektIdNavnStyle = 'style="min-width: ' + pidn + '; max-width: ' + pidn + ';font-weight:bold"';

  const vanlige = 'style="min-width: ' + pidn + '; max-width: ' + pidn + '"';

  // tslint:disable-next-line:max-line-length
  mywindow.document.write('<table>');
  mywindow.document.write('<tr>');
  mywindow.document.write('<td ' + vProsjektIdNavnStyle + ' >Prosjekt-id: </td>');
  mywindow.document.write('<td ' + vanlige + '">' + object.prosjekt_id + '</td>');
  mywindow.document.write('<td  ' + vanlige + ' ></td><td  ' + vanlige + ' ></td><td  ' + vanlige + ' ></td><td  ' + vanlige + ' ></td>');
  mywindow.document.write('</tr><tr>');
  mywindow.document.write('<td ' + vProsjektIdNavnStyle + ' >Prosjektnavn: </td>');
  mywindow.document.write('<td style="min-width: ' + pidn + '; max-width: ' + pidn + ';">' + object.prosjektnavn + '</td>');
  mywindow.document.write('</tr></table>');



  let utleveringslinje1, utleveringslinje2;

  const prikker = '......................................';



  const tag1 = '<table><tr><td style="min-width: 185mm; max-width: 185mm;">';
  const tag2 = '<tr><td style="min-width: 185mm; max-width: 185mm;">';

  if (object.innlevert_til === null || object.innlevert_til === undefined) {
    utleveringslinje1 = tag1 + 'Utlevert av ' + object.utlevert_av + '(sign): ' + prikker + prikker + '</td></tr>';

    utleveringslinje2 = tag2 + 'Utlevert til ' + object.utlevert_til + ' (sign): ' + prikker + prikker + '</td></tr>';
  } else {

    // tslint:disable-next-line:max-line-length
    utleveringslinje1 = tag1 + 'Utlevert av: ' + object.utlevert_av + ' - Innlevert til: ' + object.innlevert_til + ' (sign): ' + prikker + prikker + '</td></tr>';
    utleveringslinje2 = tag2 + 'Utlevert til: ' + object.utlevert_til + ' - Innlevert av: ' + object.innlevert_av + ' (sign): ' + prikker + prikker + '</td></tr>';
  }
  mywindow.document.write(utleveringslinje1);
  mywindow.document.write(utleveringslinje2);
  mywindow.document.write('</table>');
  mywindow.document.write('<table><tr><td></td></tr><tr><td>Utlevert:</td></tr></table>');

  // selve listen starter her
  mywindow.document.write('<table>');
  mywindow.document.write('<tr style="font-weight:bold">');


  mywindow.document.write('<td style="min-width: ' + vNavn + '; max-width:' + vNavn + '">Navn</td>');
  mywindow.document.write('<td style="min-width: ' + vIdnr + '; max-width:' + vIdnr + ';">Idnr.</td>');
  mywindow.document.write('<td style="min-width: ' + vType + '; max-width:' + vType + ';">Type</td>');
  mywindow.document.write('<td style="min-width: ' + vReol + '; max-width: ' + vReol + ';">Reol</td>');
  mywindow.document.write('<td style="min-width: ' + vHylle + '; max-width: ' + vHylle + ';">Hylle</td>');
  mywindow.document.write('<td style="min-width: ' + vPlass + '; max-width: ' + vPlass + ';">plass</td>');
  mywindow.document.write('<td style="min-width: ' + vAvsjekk + '; max-width: ' + vAvsjekk + ';">Innl</td>');
  mywindow.document.write('<td style="min-width: ' + vAvsjekk + '; max-width: ' + vAvsjekk + ';">Def.</td>');
  mywindow.document.write('</tr>');

  let teller: number = 1;
  let denneSiden: number;




  for (const verktoy of object.verktoyutleier) {



    if (teller < 20) { denneSiden = 1; }
    if (teller >= 20 && teller < 44) { denneSiden = 2; }
    if (teller >= 44 && teller < 68) { denneSiden = 3; }
    if (teller >= 69 && teller < 94) { denneSiden = 4; }
    if (teller >= 94 && teller < 118) { denneSiden = 5; }
    if (teller >= 119 && teller < 134) { denneSiden = 6; }



    if (teller === 20 || teller === 45 || teller === 70 || teller === 95 || teller === 119 || teller === 139 || teller === 164) {
      mywindow.document.write('<tr><td></td></tr>');
      mywindow.document.write('<tr><td></td></tr>');
      mywindow.document.write('</table>');

      mywindow.document.write('<table><tr style="font-weight:bold">');
      mywindow.document.write('<td ' + vDatoStyle + '">Dato for utlevering: ' + object.fra_dato + '</td>');
      mywindow.document.write('<td ' + vDatoStyle + '"> Utlånsnummer:' + object.plukkliste_id + '</td>');
      mywindow.document.write('<td ' + vTotaltAntallSiderStyle + '> Side ' + denneSiden + '/' + totaltAntallSider + '</td></tr></table>');



      mywindow.document.write('<table>');
      mywindow.document.write('<tr><td></td></tr>');
      mywindow.document.write('<tr><td></td></tr>');
      mywindow.document.write('<tr><td></td></tr>');
      mywindow.document.write('<tr style="font-weight:bold">'); // <td style="min-width: 600px; max-width: 600px;">Navn</td>');
      mywindow.document.write('<td style="min-width: ' + vNavn + '; max-width:' + vNavn + '">Navn</td>');
      mywindow.document.write('<td style="min-width: ' + vIdnr + '; max-width:' + vIdnr + ';">Idnr.</td>');
      mywindow.document.write('<td style="min-width: ' + vType + '; max-width:' + vType + ';">Type</td>');
      mywindow.document.write('<td style="min-width: ' + vReol + '; max-width: ' + vReol + ';">Reol</td>');
      mywindow.document.write('<td style="min-width: ' + vHylle + '; max-width: ' + vHylle + ';">Hylle</td>');
      mywindow.document.write('<td style="min-width: ' + vPlass + '; max-width: ' + vPlass + ';">plass</td>');
      mywindow.document.write('<td style="min-width: ' + vAvsjekk + '; max-width: ' + vAvsjekk + ';">Innl</td>');
      mywindow.document.write('<td style="min-width: ' + vAvsjekk + '; max-width: ' + vAvsjekk + ';">Def.</td>');
      mywindow.document.write('</tr>');
    }
    console.log(JSON.stringify(verktoy.verktoy));

    let reol = verktoy.verktoy.x_2, hylle = verktoy.verktoy.x_3, plass = verktoy.verktoy.x_4, navn = verktoy.verktoy.navn, type = verktoy.verktoy.x_0;

    if (verktoy.verktoy.x_2 == null) { reol = ''; }
    if (verktoy.verktoy.x_3 == null) { hylle = ''; }
    if (verktoy.verktoy.x_4 == null) { plass = ''; }
    if (verktoy.verktoy.navn == null) { navn = ''; }
    if (verktoy.verktoy.x_0 == null) { type = ''; }

    mywindow.document.write('<tr><td>' +
      navn + '</td><td>' +
      verktoy.verktoy.ressursnummer + '</td><td>' +
      type + '</td><td>' +
      reol + '</td><td>' +

      hylle + '</td><td>' +
      plass + '</td>' +
      '<td style="border:solid black"></td><td style="border:solid black"></td>' +
      '</tr>');



    teller = teller + 1;

  }


  mywindow.document.write('<tr><td></td></tr>');
  mywindow.document.write('<tr><td></td></tr>');
  mywindow.document.write('</table>');
  mywindow.document.write('<!--- Ny side -->');
  mywindow.document.write('</body></html>');
  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/
  mywindow.print();
  mywindow.close();
  return true;




}
    

     public harRolle(rolle: string) {

  return localStorage.getItem(rolle) !== null;

  // return  true;

}

getMaanedsnavn(inn){
  return this.maanedsliste[inn].navn;
}




}




