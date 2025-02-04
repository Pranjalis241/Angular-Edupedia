import { Component,OnInit, ElementRef,ViewChild,AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service'; // Import the DataService
import { Chart, ChartConfiguration, ChartType } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false, 
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit{
  user: any;
  users: any[] = [];
  contacts: any[] = [];
  newUser: any = { name: '', dob: '', email: '', role: 'user' }; // New user object
  selectedUser: any = {};
   @ViewChild('chartCanvas') chartCanvas!: ElementRef;
   chart!: Chart;
   chartType: string = 'pie'; // Default chart type
   courses: any[] = [];
   filteredCourses: any[] = []; 
   searchQuery: string = '';
    // Chart data
  pieChartLabels: string[] = [];
  pieChartData: number[] = [];
  pieChartType: ChartType = 'pie';

  constructor(private dataService: DataService, private router: Router) {}
  
  ngOnInit(): void {
    this.loadUserData();
    this.fetchUsers();
    this.fetchContacts();
     // Fetch courses and then initialize the chart
  this.dataService.getAllCourses().subscribe((data) => {
    this.courses = data;
    this.pieChartLabels = this.courses.map(course => course.title);
    this.pieChartData = this.courses.map(course => course.count || 0);

    this.loadChart(); // Now call loadChart() after data is available
  });
   
  }

  ngAfterViewInit(): void {
    this.loadChartData(); // Ensure the chart data is loaded after view initialization
  }

  // Fetch user data
  loadUserData() {
    const userEmail = localStorage.getItem('userEmail');
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

  // Fetch all users
  fetchUsers(): void {
    this.dataService.getUsers().subscribe(
      (data) => {
        this.users = data || [];
      },
      (error) => {
        console.error('Error fetching users:', error);
        alert('Failed to load users');
      }
    );
  }

  openEditModal(user: any): void {
    this.selectedUser = { ...user };
  }

  // Fetch contacts
  fetchContacts(): void {
    this.dataService.getContacts().subscribe(
      (data) => {
        this.contacts = data;
      },
      (error) => {
        console.error('Error fetching contacts:', error);
        alert('Failed to load contacts');
      }
    );
  }

  // Add a new user
  addUser(): void {
    this.dataService.addUser(this.newUser).subscribe(
      (response) => {
        alert('User added successfully!');
        this.users.push(response);
        this.newUser = { name: '', dob: '', email: '', role: 'user', password: '' };
        this.loadChartData(); // Refresh chart after adding a user
      },
      (error) => {
        console.error('Error adding user:', error);
        alert('Failed to add user. Please try again.');
      }
    );
  }

  // Delete a user
  deleteUser(userId: string, index: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.dataService.deleteUser(userId).subscribe(
        () => {
          alert('User deleted successfully.');
          this.users.splice(index, 1);
          this.loadChartData(); // Refresh chart after deleting a user
        },
        (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again.');
        }
      );
    }
  }

  updateUser(): void {
    this.dataService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(
      (response) => {
        alert('User updated successfully!');
        const index = this.users.findIndex((u) => u.id === this.selectedUser.id);
        if (index !== -1) {
          this.users[index] = { ...this.selectedUser };
        }
        this.loadChartData(); // Refresh chart after updating a user
      },
      (error) => {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
      }
    );
  }

  loadChart() {
    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: this.pieChartLabels,
        datasets: [
          {
            data: this.pieChartData,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800', '#9C27B0','#f155dd'
            ]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
             position: 'bottom',
            labels: {
              font: {
                size: 20  // Adjust size of legend labels
              },  usePointStyle: true, // Makes icons small and inline
              boxWidth: 20
            }
          },
          tooltip: {
            bodyFont: {
              size: 24  // Adjust size of tooltip text
            }
          }
        },
       
      }
      
    });
  }
  // Fetch role counts and update chart dynamically
  loadChartData(): void {
    this.dataService.getUsers().subscribe((users) => { //Calls getUsers() from dataService to fetch user data.
      const roleCounts = this.countRoles(users);   //Passes the data to countRoles() to calculate the number of users, trainers, and admins.
      this.renderChart(roleCounts); //Calls renderChart() to display the data in a pie chart.
    });
  }

  countRoles(users: any[]): { users: number; trainers: number; admins: number } {
    let roleCounts = { users: 0, trainers: 0, admins: 0 };
    users.forEach((user) => {
      if (user.role === 'user') roleCounts.users++;
      else if (user.role === 'trainer') roleCounts.trainers++;
      else if (user.role === 'admin') roleCounts.admins++;
    });
    return roleCounts;
  }

  renderChart(roleCounts: { users: number; trainers: number; admins: number }): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    if (this.chart) {
      this.chart.destroy(); // Destroy existing chart before re-rendering
    }

    const chartColors = ['#4CAF50', '#FFC107', '#F44336']; // Green, Yellow, Red
    const labels = ['Users', 'Trainers', 'Admins'];
    const dataValues = [roleCounts.users, roleCounts.trainers, roleCounts.admins];
  

    this.chart = new Chart(ctx, {
      type: this.chartType as any,
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Role Distribution',
            data: dataValues,
            backgroundColor: this.chartType === 'pie' || this.chartType === 'polarArea' ? chartColors : chartColors.map(color => color + '80'), // Add transparency for bar/line
            borderColor: chartColors, // Ensures colors are correctly assigned
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Ensures proper resizing
        scales: this.chartType === 'bar' || this.chartType === 'line' ? {
          y: {
            beginAtZero: true
          }
        } : {}, // Add scales only for bar and line charts
        plugins: {
          legend: { //legend is the box that shows labels for different data categories.
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 16, // Increase legend font size
              },
            },
          },
          datalabels: {  // numerical values shown inside the chart 
            color: '#fff',
            formatter: (value: number) => value,
            font: {
              size:19,
              weight: 'bold',
            },
          },
          
        },
      },
      plugins: [ChartDataLabels], //Uses ChartDataLabels plugin to display values on the chart.
    });
  }
  changeChartType(type: string): void {
    this.chartType = type;
    this.loadChartData(); // Refresh chart with new type
  }
}
