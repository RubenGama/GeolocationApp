import { Component, OnInit } from '@angular/core';
import { WeatherServiceService } from '../weather-service.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-city-info',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './city-info.component.html',
  styleUrl: './city-info.component.scss',
  providers:[WeatherServiceService]
})
export class CityInfoComponent implements OnInit {

  geoData:any;
  baseUrl!: string;
  lat!:number;
  lon!:number;
  city!:string;
  weatherData: any;

constructor(private weatherService:WeatherServiceService, private route: Router,){
  this.baseUrl = this.route.url;
}

ngOnInit(): void {
 this.lat = parseInt(this.baseUrl.split('/')[2])
this.lon = parseInt(this.baseUrl.split('/')[3])
this.city = this.baseUrl.split('/')[4]
  this.getCityFromCoordinates(this.lat,this.lon)
  this.getWheather();
}

  getCityFromCoordinates(lat: number, lon: number): void {
    this.weatherService.getCityByCoordinates(lat, lon).subscribe(
      (data) => {
        if(data)
          {
            this.geoData = data.data[0];
          }
      },
      (error) => {
        console.error('Error fetching admin divisions:', error);
      }
    );
  }

  getWheather() {
    if (this.city) {
      this.weatherService.getWheather(this.city).subscribe((data) => {
        this.weatherData = data;
        const lat = this.weatherData?.location?.lat;
        const lon = this.weatherData?.location?.lon;
        if (lat !== undefined && lon !== undefined) {
          this.weatherService.updateLocation(lat, lon);
        } else {
          console.error('Latitude or Longitude is undefined in weather data');
        }
      });
    }
  }

}
