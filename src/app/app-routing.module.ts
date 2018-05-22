import { StoffkartotekComponent } from './stoffkartotek/stoffkartotek.component';
import { ImageComponent } from './kandidater/kandidat/image/image.component';
import { KandidaterComponent } from './kandidater/kandidater.component';
import { ResetPassordComponent } from './reset-passord/reset-passord.component';
import { RollerComponent } from './roller/roller.component';
import { BrukereComponent } from './brukere/brukere.component';
import { VerktoyComponent } from './verktoy/verktoy.component';
import { VerneutsyrComponent } from './verneutsyr/verneutsyr.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrakkeriggComponent } from './brakkerigg/brakkerigg.component';
import { ArbeidstoyComponent } from './arbeidstoy/arbeidstoy.component';



const appRoutes: Routes = [
  // { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  // { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'brakkerigg', component: BrakkeriggComponent },
  { path: 'verneutstyr', component: VerneutsyrComponent },
  { path: 'arbeidstoy', component: ArbeidstoyComponent },
  { path: 'verktoy', component: VerktoyComponent },
  { path: 'brukere', component: BrukereComponent },
  { path: 'roller', component: RollerComponent },
  { path: 'reset_passord', component: ResetPassordComponent },
  { path: 'kandidater', component: KandidaterComponent },
  { path: 'image', component: ImageComponent },
  { path: 'stoffkartotek', component: StoffkartotekComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
