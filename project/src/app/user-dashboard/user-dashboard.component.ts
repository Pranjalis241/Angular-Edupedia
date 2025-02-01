import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
import { DataService } from '../data.service'; // Import the DataService

@Component({
  selector: 'app-user-dashboard',
  standalone: false,
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent  implements AfterViewInit{
  user: any; // To store the logged-in user's details
  selectedUser: any = {};
  users: any[] = [];
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  constructor(private dataService: DataService, private router: Router) {}
  ngOnInit(): void {
    this.loadUserData();
    
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
  
  deleteCourse(courseId: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.dataService.deleteuserCourse(this.user.id, courseId).subscribe(
        () => {
          alert('Course deleted successfully!');
          this.loadUserData(); // Refresh the UI
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
