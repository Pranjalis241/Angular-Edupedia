import { Component } from '@angular/core';
import { DataService } from '../data.service'; //import service
 
@Component({
  selector: 'app-courses',
  standalone: false,
  
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent  {
  courses: any[] = [];
  filteredCourses: any[] = []; //to search course
  searchQuery: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getAllCourses().subscribe(data => {
      this.courses = data;
      this.filteredCourses = data;
    });
  }
  filterCourses(): void {
    this.filteredCourses = this.courses.filter(course =>
      course.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  enrollInCourse(course: any) {
    const userEmail = localStorage.getItem('userEmail');  
    if (userEmail) {
      this.dataService.getUsers().subscribe((users) => {
        const user = users.find((u: any) => u.email === userEmail);
        if (user) {
          // Increase course count
          course.count = (course.count || 0) + 1;
  
          // First, update the course count
          this.dataService.updateCourseCount(course.id, course.count).subscribe(
            () => {
              // Then, add the course to the user's enrolled courses
              this.dataService.updateUserCourses(user.id, course).subscribe(
                () => {
                  alert('Successfully enrolled in the course!');
                },
                (error) => {
                  console.error('Error updating user courses:', error);
                  alert('Failed to enroll in course');
                }
              );
            },
            (error) => {
              console.error('Error updating course count:', error);
              alert('Failed to enroll in course');
            }
          );
        }
      });
    } else {
      alert('Please log in first');
    }
  }
  
  
 }