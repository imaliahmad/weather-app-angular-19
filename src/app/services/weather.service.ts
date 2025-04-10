import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WeatherData } from '../models/weather-data.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly API_URL = 'https://api.openweathermap.org/data/2.5';
  private readonly API_KEY = environment.weatherApiKey;

  constructor(private http: HttpClient) {}

  getWeatherByCoordinates(lat: number, lon: number) {
    return this.http.get<any>(
      `${this.API_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${this.API_KEY}&units=metric`
    ).pipe(
      map(response => {
        // Get city name from a separate API call
        return this.http.get<any>(`${this.API_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`).pipe(
          map(cityData => {
            return this.transformWeatherData(
              response, 
              cityData.name, 
              cityData.sys.country
            );
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching weather data:', error);
        return throwError(() => new Error('Failed to load weather data. Please try again later.'));
      })
    );
  }

  getWeatherByCity(cityName: string, countryCode: string) {
    return this.http.get<any>(
      `${this.API_URL}/weather?q=${cityName},${countryCode}&appid=${this.API_KEY}&units=metric`
    ).pipe(
      map(cityData => {
        const lat = cityData.coord.lat;
        const lon = cityData.coord.lon;
        
        return this.http.get<any>(
          `${this.API_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${this.API_KEY}&units=metric`
        ).pipe(
          map(response => {
            return this.transformWeatherData(
              response, 
              cityData.name, 
              cityData.sys.country
            );
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching weather data:', error);
        return throwError(() => new Error('Failed to load weather data. Please try again later.'));
      })
    );
  }

  private transformWeatherData(data: any, cityName: string, countryCode: string): WeatherData {
    const current = {
      temperature: data.current.temp,
      feelsLike: data.current.feels_like,
      humidity: data.current.humidity,
      pressure: data.current.pressure,
      windSpeed: data.current.wind_speed,
      windDirection: data.current.wind_deg,
      description: data.current.weather[0].description,
      icon: data.current.weather[0].icon,
      main: data.current.weather[0].main,
      timestamp: data.current.dt
    };

    const hourly = data.hourly.slice(0, 24).map((hour: any) => ({
      time: hour.dt,
      temperature: hour.temp,
      feelsLike: hour.feels_like,
      icon: hour.weather[0].icon,
      description: hour.weather[0].description,
      precipitation: hour.pop * 100 // Convert probability to percentage
    }));

    const daily = data.daily.map((day: any) => ({
      date: day.dt,
      minTemp: day.temp.min,
      maxTemp: day.temp.max,
      humidity: day.humidity,
      description: day.weather[0].description,
      icon: day.weather[0].icon,
      main: day.weather[0].main,
      precipitation: day.pop * 100, // Convert probability to percentage
      windSpeed: day.wind_speed
    }));

    return {
      current,
      hourly,
      daily,
      location: {
        name: cityName,
        country: countryCode,
        lat: data.lat,
        lon: data.lon
      }
    };
  }

  

}
