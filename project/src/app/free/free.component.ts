import { Component } from '@angular/core';
import { DataService } from '../data.service'; //import service
 
@Component({
  selector: 'app-free',
  standalone: false,
  templateUrl: './free.component.html',
  styleUrls: ['./free.component.css'], // Fixed property name
})
export class FreeComponent {
  courses: any[] = [];
  ratings: number[] = [50, 45, 60]; // Initial ratings for each card
  thumbStates: boolean[] = [false, false, false]; // Track if thumb is active for each card
  favorites: boolean[] = [false, false, false]; // Track favorite state for each card

  
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getCourses().subscribe((data) => {
      this.courses = data;
    });
  }

  toggleThumb(index: number): void {
    this.thumbStates[index] = !this.thumbStates[index];
    if (this.thumbStates[index]) {
      this.ratings[index]++;
    } else {
      this.ratings[index]--;
    }
  }

  toggleFavorite(index: number): void {
    this.favorites[index] = !this.favorites[index];
  }
}
