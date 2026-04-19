import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlayerComponent } from './components/player/player.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'video/:id', component: PlayerComponent },
  { path: '**', redirectTo: '' }
];
