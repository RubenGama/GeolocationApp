import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { Observable, Subject, catchError, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
}
)

export class WeatherServiceService {
   
  constructor(private httpClient: HttpClient) {}
  
  apiKey = 'f7b98721d3a648d096895006241706 ';
  
  private apiUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
  
  private headers = new HttpHeaders({
    'x-rapidapi-key': '48107821bemsh6b3faaac6fefef8p15dba3jsne13db2463b40',
    'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
  });
  
  getWheather(city: string) {
    return this.httpClient.get(
      ` http://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${city}`
    );
  }

  private locationSubject = new Subject<{ lat: number, lon: number }>();
  location$ = this.locationSubject.asObservable();

  updateLocation(lat: number, lon: number) {
    this.locationSubject.next({ lat, lon });
  }

  convertTimezoneOffsetToIdentifier(offsetSeconds: number): string {
    return moment.tz.guess(true).split('|')[0];
  }


  getCityByCoordinates(lat: number, lon: number): Observable<any> {
    const headers = new HttpHeaders({
      'x-rapidapi-key': '48107821bemsh6b3faaac6fefef8p15dba3jsne13db2463b40',
      'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
    });

    
    // Check if lat or lon is undefined
    if (lat === undefined || lon === undefined) {
      return throwError('Latitude or Longitude is undefined');
    }

    // Format coordinates as per ISO 6709 standard
    const formattedLat = lat >= 0 ? `+${lat.toFixed(4)}` : `${lat.toFixed(4)}`;
    const formattedLon = lon >= 0 ? `+${lon.toFixed(4)}` : `${lon.toFixed(4)}`;
    const locationParam = `${formattedLat}${formattedLon}`;

    // Set parameters for the HTTP GET request
    const params = new HttpParams()
      .set('location', locationParam);

    // Make the HTTP GET request with headers and parameters
    return this.httpClient.get<any>(this.apiUrl, { headers, params }).pipe(
      catchError(error => {
        console.error('Error fetching city data:', error);
        return throwError('Failed to fetch city data');
      })
    );
  }

}

