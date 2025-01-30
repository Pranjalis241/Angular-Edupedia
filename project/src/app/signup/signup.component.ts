import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service'; //import service
 
@Component({
  selector: 'app-signup',
  standalone: false,
 
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm!: FormGroup;
 
  constructor(private fb: FormBuilder, private router: Router, private dataService: DataService) {
    this.createForm();
  }

  createForm() {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(5)]],
        email: ['', [Validators.required, Validators.email]],
        dob: ['', Validators.required],
        role:['', Validators.required],
        phone: ['', [Validators.pattern(/^\d{10}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        terms: [false, Validators.requiredTrue],
      },
      { validator: this.mustMatch('password', 'confirmPassword') }
    );
  }

  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[password];
      const matchingControl = formGroup.controls[confirmPassword];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  successMessage: string = ''; // Add this property to store the success message.
  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Form Submitted!', this.signupForm.value);
      this.dataService.addUser(this.signupForm.value).subscribe(response => {
        console.log('User added:', response);
        this.successMessage = 'Thank you for signing up!';
        // this.router.navigate(['/login']);  // Redirect to login after signup
      });
    }
  }
}