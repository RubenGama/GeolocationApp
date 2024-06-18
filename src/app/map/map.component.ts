import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { GeolocationService } from '../geolocation.service';
import { AppComponent } from '../app.component';
import { Subscription } from 'rxjs';
import { UtilsService } from '../utils.service';
import { WeatherServiceService } from '../weather-service.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
})
export class MapComponent implements OnInit {
  private map: L.Map | undefined;
  private locationSubscription!: Subscription;
  @Input() city: string = '';
  geoData:any;

  constructor(
    private geolocationService: GeolocationService,
    private utilsService: UtilsService,
    private wheaterService: WeatherServiceService
  ) {}

  ngOnInit(): void {
    if (this.utilsService.isBrowser()) {
      this.geolocationService
        .getCurrentPosition()
        .then((position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.initMap(lat, lon);
        })
        .catch((error) => {
          console.error('Error getting location', error);
        });
    } else {
      console.error('Not running in the browser');
    }
    this.locationSubscription = this.wheaterService.location$.subscribe(
      (location) => {
        this.updateMap(location.lat, location.lon);
      }
    );
  }
  ngOnDestroy(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

  private initMap(lat: number, lon: number): void {
    this.map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(
      this.map
    );

    L.marker([lat, lon]).addTo(this.map).bindPopup('You are here!').openPopup();
  }

  private updateMap(lat: number, lon: number): void {
    if (this.map) {
      this.map.setView([lat, lon], 13);

      L.marker([lat, lon])
        .addTo(this.map)
        .bindPopup(`New location!`)
        .openPopup();
    }
  }

 
}
