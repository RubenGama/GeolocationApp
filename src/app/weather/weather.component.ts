import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from '../map/map.component';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OnlyTextDirective } from '../text-only.directive';
import { Subject } from 'rxjs';
import { WeatherServiceService } from '../weather-service.service';
import { CityInfoComponent } from '../city-info/city-info.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MapComponent,
    FontAwesomeModule,
    OnlyTextDirective,
    CityInfoComponent,
    RouterModule
  ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
  providers: [WeatherServiceService],
})
export class WeatherComponent {
  constructor(private weatherService: WeatherServiceService) {}
  city = '';
  weatherData: any;
  location: string = 'Detecting location...';
  browserLanguage: string = 'en';
  localTime: string = '';
  localDayOfWeek: string = '';
  faSearch = faSearch;
  private cityChangedSubject = new Subject<string>();
  cityChanged$ = this.cityChangedSubject.asObservable();
  geoData: any;
  isCelsius: boolean = true;
  detectLat:any;
  detectLon:any;
  isLoading: boolean = false;
  isLoadingLocation: boolean = false;

  ngOnInit(): void {
    this.browserLanguage = navigator.language || 'en';

    this.detectLocation();
    this.getWeather();

  }

  

  // getWheather() {
  //   if (this.city) {
  //     this.weatherService.getWheather(this.city).subscribe((data) => {
  //       this.weatherData = data;
  //       const lat = this.weatherData?.location?.lat;
  //       const lon = this.weatherData?.location?.lon;
  //       if (lat !== undefined && lon !== undefined) {
  //         this.weatherService.updateLocation(lat, lon);
  //         this.getLocationDetails();
  //       } else {
  //         console.error('Latitude or Longitude is undefined in weather data');
  //         this.location = 'Location not available';
  //       }
  //     });
  //   }
  // }

  getWeather(): void {
    if (this.city) {
      this.isLoading = true; // Ativa o spinner ao iniciar o carregamento
      this.weatherService.getWheather(this.city).subscribe(
        (data) => {
          this.weatherData = data;
          const lat = this.weatherData?.location?.lat;
          const lon = this.weatherData?.location?.lon;
          if (lat !== undefined && lon !== undefined) {
            this.weatherService.updateLocation(lat, lon);
            this.getLocationDetails();
          } else {
            console.error('Latitude or Longitude is undefined in weather data');
            this.location = 'Location not available';
          }
        },
        (error) => {
          console.error('Error fetching weather data', error);
        },
        () => {
          this.isLoading = false; // Desativa o spinner ao completar o carregamento
        }
      );
    }
  }

  detectLocation(): void {
    
    this.isLoading = true
  
    if (navigator.geolocation) {
      this.isLoadingLocation = true;

      const options: PositionOptions = {
        
        timeout: 10000, 
        enableHighAccuracy: true 
      };
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.detectLat = position.coords.latitude;
          this.detectLon = position.coords.longitude;
          this.getCityFromCoordinates(this.detectLat, this.detectLon);
          this.isLoading = false; // Desativa o spinner se a geolocalização não for suportada
        },
        (error) => {
          console.error('Error detecting location:', error);
          this.location = 'Location not available';
        },
        options // Passa as opções de posição
      );
    } else {
      this.location = 'Geolocation is not supported by this browser.';
      
    }
  }
  

  setCelsius() {
    this.isCelsius = true;
  }

  setFahrenheit() {
    this.isCelsius = false;
  }

  convertToCelsius(celcius: number): number {
    return Math.round(celcius);
  }

  convertToFahrenheit(fahrenheit: number): number {
    return Math.round(fahrenheit);
  }

  // detectLocation(): void {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         this.detectLat = position.coords.latitude;
  //         this.detectLon = position.coords.longitude;
  //         this.getCityFromCoordinates(this.detectLat, this.detectLon);
  //       },
  //       (error) => {
  //         console.error('Error detecting location:', error);
  //         this.location = 'Location not available';
  //       }
  //     );
  //   } else {
  //     this.location = 'Geolocation is not supported by this browser.';
  //   }
  // }

 

  getLocationDetails() {
    const location = this.weatherData?.location;
  
    // Check if `location` contains the `localtime` property
    if (location && location.localtime) {
      const localTime = new Date(location.localtime); // Convert the localtime string to a Date object
  
      // Determine the browser's language or default to 'en-US'
      const browserLanguage = navigator.language || 'en-US';
  
      // Format the local time with AM/PM
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      this.localTime = new Intl.DateTimeFormat(browserLanguage, timeOptions).format(localTime);
  
      // Format the local day of the week
      const dayOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
      };
      this.localDayOfWeek = new Intl.DateTimeFormat(browserLanguage, dayOptions).format(localTime);
    } else {
      console.error('Local time not available in weather data');
      this.localTime = 'Time not available';
      this.localDayOfWeek = 'Day not available';
    }
  }
  

  getCityFromCoordinates(lat: number, lon: number): void {
    this.weatherService.getCityByCoordinates(lat, lon).subscribe(
      (data) => {
        if (data && data.data && data.data[0]) {
          const city = data.data[0].city;
          this.city = city || 'Unknown location';
          this.getWeather();
        } else {
          console.error('No city data available in response:', data);
          this.city = 'Unknown location';
        }
      },
      (error) => {
        console.error('Error fetching city data:', error.message, error);
        this.location = 'Location not available';
      }
    );
  }
  
}
