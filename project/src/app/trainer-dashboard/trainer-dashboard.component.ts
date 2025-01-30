import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service'; // Import the DataService

@Component({
  selector: 'app-trainer-dashboard',
  standalone: false,
  templateUrl: './trainer-dashboard.component.html',
  styleUrl: './trainer-dashboard.component.css'
})
export class TrainerDashboardComponent {
  user: any;
  newCourse = {
    title: '',
    description: '',
    image: '',
    price: '',
    teacher: '',
  };
  constructor(private dataService: DataService, private router: Router) {}
  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    const userEmail = localStorage.getItem('userEmail'); // Email is stored during login
    if (userEmail) {
      this.dataService.getUsers().subscribe(
        (users) => {
          this.user = users.find((u: any) => u.email === userEmail);
          if (!this.user || this.user.role !== 'trainer') {
            alert('User not found or not a trainer');
            this.router.navigate(['/login']);
          }
        },
        (error) => {
          console.error('Error fetching user data:', error);
          alert('Failed to load user data');
        }
      );
    } else {
      alert('No user logged in');
      this.router.navigate(['/login']);
    }
  }
  
  
  addCourse() {
    if (this.user && this.user.role === 'trainer') {
      const course = {
        ...this.newCourse,
        id: Date.now().toString(), // Generate a unique ID for the course
        teacher: this.user.name,
      };
  
      this.dataService.addCourse(this.user.id, course).subscribe(
        () => {
          alert('Course added successfully!');
          this.newCourse = {
            title: '',
            description: '',
            image: '',
            price: '',
            teacher: '',
          };
          this.loadUserData(); // Refresh user data to include the new course
        },
        (error) => {
          console.error('Error adding course:', error);
          alert('Failed to add course');
        }
      );
    }
  }
  deleteCourse(courseId: string) {
  if (this.user && this.user.role === 'trainer') {
    this.dataService.deleteCourse(this.user.id, courseId).subscribe(
      () => {
        alert('Course deleted successfully!');
        this.loadUserData(); // Refresh the trainer's course list
      },
      (error) => {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    );
  }
}

  
}
