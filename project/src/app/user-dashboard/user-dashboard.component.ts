import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
import { DataService } from '../data.service'; 
import { Observable } from 'rxjs';
import { select,Store } from '@ngrx/store';
import { loginSuccess } from '../auth.action';
import { AuthState } from '../auth.state';

@Component({
  selector: 'app-user-dashboard',
  standalone: false,
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent  implements AfterViewInit{
   user: any; // To store the logged-in user's details
   userWelcome$: Observable<{  name: string; email: string} | null>;
  selectedUser: any = {};
  users: any[] = [];
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  constructor(
    private dataService: DataService,
    private router: Router,
    private store: Store<{ auth: AuthState }> // Inject NgRx store
  ) {
    // Select user from NgRx store
    this.userWelcome$ = this.store.select((state) => state.auth.user);
  }
  ngOnInit(): void {
    this.loadUserData();//Existing RxJS function
    this.loadWelcomeData(); // New function using NgRx
  }

  ngAfterViewInit(): void {
    this.renderChart(); // Call renderChart after the view has been initialized
  }
  openEditModal(user: any): void {
    this.selectedUser = { ...user }; // Creates a copy of the user object
    console.log(this.selectedUser); // Debugging: Check if the user data is correctly assigned
  }

  loadUserData() {
    const userEmail = localStorage.getItem('userEmail'); // email is stored during login
    if (userEmail) {
      this.dataService.getUsers().subscribe(
        (users) => {
          this.user = users.find((u: any) => u.email === userEmail);
          if (!this.user) {
            alert('User not found');
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
   // New Function Using NgRx
   loadWelcomeData() {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      this.dataService.getUsers().subscribe(
        (users) => {
          const user = users.find((u: any) => u.email === userEmail);
          if (user) {
            this.store.dispatch(loginSuccess({ user })); // Store user in NgRx
          }
        },
        (error) => {
          console.error('Error loading welcome data:', error);
        }
      );
    }
  }


  updateUser(): void {
    this.dataService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(
      (response) => {
        alert('User updated successfully!');
        this.loadUserData(); // Refresh user details
      },
      (error) => {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
      }
    );
  }
  
  deleteCourse(courseId: any): void {
    if (confirm('Are you sure you want to delete this course?')) {
      // Find the course in user's enrolled courses
      const course = this.user.courses.find((c: any) => c.id === courseId);
      if (!course) return;
  
      this.dataService.deleteuserCourse(this.user.id, courseId).subscribe(
        () => {
          // Decrease course count
          course.count = Math.max((course.count || 1) - 1, 0); // Ensure count doesn't go negative
  
          // Update the course count in the database
          this.dataService.updateCourseCount(courseId, course.count).subscribe(
            () => {
              alert('Course deleted successfully!');
              this.loadUserData(); // Refresh UI
            },
            (error) => {
              console.error('Error updating course count:', error);
              alert('Failed to update course count.');
            }
          );
        },
        (error) => {
          console.error('Error deleting course:', error);
          alert('Failed to delete course. Please try again.');
        }
      );
    }
  }
  
  
  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.dataService.deleteUser(this.user.id).subscribe(
        () => {
          alert('Account deleted successfully!');
          localStorage.removeItem('userEmail'); // Remove login session
          this.router.navigate(['/signup']); // Redirect to the Signup Page
        },
        (error) => {
          console.error('Error deleting account:', error);
          alert('Failed to delete account. Please try again.');
        }
      );
    }
  }
  

  renderChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Completed', 'In Progress', 'Pending'],
        datasets: [
          {
            data: [60, 25, 15], 
            backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
        },
      },
    });
  }
}
