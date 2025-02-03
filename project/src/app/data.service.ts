import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:3000';
  private apiUrl = 'http://localhost:3000/contacts';  // for contacts data
  private usersUrl = 'http://localhost:3000/users';  // for users data
  private geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText';
  private apiKey = 'AIzaSyDURlxLZ9x0cUlnZ_wBn8tX14JjCYoFqvs';

  constructor(private http: HttpClient) {}

  getResponse(message: string): Observable<any> {
    const body = {
      "model": "gemini-1.5-flash",  // Correct model name
      "prompt": { "text": message },  // User's input text
      "temperature": 0.7  // Optional, controls randomness
    };

  return this.http.post(`${this.geminiApiUrl}?key=${this.apiKey}`, body);
}


  // Method to add a new contact
  addItem(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }

  // Method to get all contacts
  getContacts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Method to add a new user who subscribe
  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.usersUrl, user);
  }

  // Method to fetch all users
  getUsers(): Observable<any> {
    return this.http.get<any>(this.usersUrl);
  }
  
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.usersUrl}/${userId}`);
  }
  
  updateUser(userId: string, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.usersUrl}/${userId}`, updatedData);

  }
   // Get user by ID
   getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  
  getCourses(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/courses');
  }

  getAllCourses(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/allcourses');
  }
  
  addCourse(userId: string, course: any): Observable<any> {
    // Step 1: Add the course to the "allcourses" array
    const allCourses$ = this.http.post(`${this.baseUrl}/allcourses`, course);
  
    // Step 2: Add the course to the trainer's courses in the "users" array
    const updateUserCourses$ = this.http.get<any>(`${this.baseUrl}/users/${userId}`).pipe(
      switchMap((user) => {
        // Ensure the user has a 'courses' property; initialize if missing
        const updatedCourses = user.courses ? [...user.courses, course] : [course];
  
        // Update the trainer's "courses" property
        return this.http.patch(`${this.baseUrl}/users/${userId}`, {
          courses: updatedCourses,
        });
      })
    );
  
    // Step 3: Combine both requests
    return forkJoin([allCourses$, updateUserCourses$]);
  }
  
  updateCourseCount(courseId: string, count: number) {
    return this.http.patch(`http://localhost:3000/allcourses/${courseId}`, { count });
  }
  

 // Method to update user courses
  updateUserCourses(userId: string, course: any): Observable<any> {
    return this.http.get<any>(this.usersUrl).pipe(
      map((users) => {
        // Find the user with the matching userId
        const user = users.find((u: any) => u.id === userId);
        if (user) {
          // Add the new course to the user's courses array
          const updatedCourses = [...(user.courses || []), course];
          
          // Update the user with their existing details and the new courses
          return { ...user, courses: updatedCourses };
        } else {
          throw new Error('User not found');
        }
      }),
      switchMap((updatedUser) => {
        // Send the updated user data to the server
        return this.http.put<any>(`${this.usersUrl}/${updatedUser.id}`, updatedUser);
      })
    );
  }

  deleteuserCourse(userId: number, courseId: number) {
    return this.http.get<any>(`${this.usersUrl}/${userId}`).pipe(
      switchMap((user) => {
        if (!user || !user.courses) {
          throw new Error('User or courses not found');
        }
  
        // Filter out the course to be deleted
        user.courses = user.courses.filter((course: any) => course.id !== courseId);
  
        // Update the user data
        return this.http.put(`${this.usersUrl}/${userId}`, user);
      })
    );
  }
  

  deleteCourse(userId: string, courseId: string): Observable<any> {
    // Step 1: Delete the course from the "allcourses" array
    const deleteFromAllCourses$ = this.http.delete(`${this.baseUrl}/allcourses/${courseId}`);
  
    // Step 2: Remove the course from the trainer's "courses" array
    const updateUserCourses$ = this.http.get<any>(`${this.baseUrl}/users/${userId}`).pipe(
      switchMap((user) => {
        const updatedCourses = user.courses?.filter((course: any) => course.id !== courseId) || [];
        return this.http.patch(`${this.baseUrl}/users/${userId}`, { courses: updatedCourses });
      })
    );
  
    // Step 3: Combine both operations
    return forkJoin([deleteFromAllCourses$, updateUserCourses$]);
  }
  
  
  // Method to login user and store details in localStorage
  // Inside DataService login method
login(email: string, password: string): Observable<any> {
  return this.http.get<any>(this.usersUrl).pipe(
    map((users) => {
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        // Store user details in localStorage
        localStorage.setItem('userEmail', user.email);  // Store email
        localStorage.setItem('userRole', user.role);    // Store role (user/trainer)
        return user;
      } else {
        throw new Error('Invalid email or password');
      }
    })
  );
}

  
}