import { Component, Input } from '@angular/core';
import { CurrentWeather } from '../../models/current-weather.model';

@Component({
  selector: 'app-current-weather',
  imports: [],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.scss'
})
export class CurrentWeatherComponent {
  @Input() currentWeather!: CurrentWeather;
  
  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@4x.png`;
  }
  
  getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }
}
