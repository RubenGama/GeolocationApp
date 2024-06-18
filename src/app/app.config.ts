import { ApplicationConfig, Component } from '@angular/core';
import { Routes, provideRouter } from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MapComponent } from './map/map.component';
import { WeatherComponent } from './weather/weather.component';
import path from 'path';
import { CityInfoComponent } from './city-info/city-info.component';
export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/weather', 
    pathMatch: 'full' 
  },
  {
    path: 'weather',
    component: WeatherComponent,
  },
  {
    path: 'city-info/:lat/:lon/:city',
    component: CityInfoComponent,
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
  ],
};
