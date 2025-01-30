import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service'; // Import the DataService

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit{
  user: any;
  users: any[] = [];
  contacts: any[] = [];
  newUser: any = { name: '', dob: '', email: '', role: 'user' }; // New user object
  selectedUser: any = {};

  constructor(private dataService: DataService, private router: Router) {}
  
  ngOnInit(): void {
    this.loadUserData();
    this.fetchUsers();
    this.fetchContacts();
    
  }
 
  
// Fetch user data
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
    // Fetch all users
  fetchUsers(): void {
    this.dataService.getUsers().subscribe(
      (data) => {
        this.users = data || []; // Fallback to an empty array
      },
      (error) => {
        console.error('Error fetching users:', error);
        alert('Failed to load users');
      }
    );
  }
  openEditModal(user: any): void {
    this.selectedUser = { ...user }; // Creates a copy of the user object
    console.log(this.selectedUser); // Debugging: Check if the user data is correctly assigned
  }

  // Fetch contacts
  fetchContacts(): void {
    this.dataService.getContacts().subscribe(
      (data) => {
        this.contacts = data; // Assign the fetched data
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
        this.users.push(response); // Add the new user to the local list
        this.newUser = { name: '', dob: '', email: '', role: 'user',password:'' }; // Reset form

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
          this.users.splice(index, 1); // Remove the user from the local list
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
          this.users[index] = { ...this.selectedUser }; // Update the user in the local array
        }
      },
      (error) => {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please try again.');
      }
    );
  }
}
 
  
 