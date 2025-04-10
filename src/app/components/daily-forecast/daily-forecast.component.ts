import { Component, Input } from '@angular/core';
import { DailyForecast } from '../../models/daily-forecast.model';

@Component({
  selector: 'app-daily-forecast',
  imports: [],
  templateUrl: './daily-forecast.component.html',
  styleUrl: './daily-forecast.component.scss'
})
export class DailyForecastComponent {
  @Input() dailyForecast!: DailyForecast[];
  
  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}.png`;
  }
  
  formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  
  getDay(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
}
