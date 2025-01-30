import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';  //import service file
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  contact = {
    name: '',
    email: '',
    message: '',
  };
  userData: any = null; // To store the submitted user's data
  successMessage: string = ''; // To store the success message

  // Replace with your Email.js credentials
  private serviceId = 'service_xt41kta';
  private templateId = 'template_9yirwvg';
  private userId = 'EbX3e8V7M94yOr-lk';

  constructor(private dataService: DataService) {}

  onSubmit() {
    // Send form data to the backend
    this.dataService.addItem(this.contact).subscribe(
      (response) => {
        console.log('Contact Data added:', response);
        this.userData = response; // Store the submitted user's data
        this.successMessage = 'Your message has been sent successfully!';

        // Email.js: Send email using the template
        const templateParams = {
          from_name:"Edupedia",
          to_name: this.contact.name,
          to_email: this.contact.email,
          message: "Thank you for contacting us",
        };

        emailjs
        .send(this.serviceId, this.templateId, templateParams, this.userId)
        .then(
          (response) => {
            console.log('Email sent successfully!', response.status, response.text);
          },
          (error) => {
            console.error('Failed to send email:', error);
          }
        );

        // Reset the form
        this.contact = { name: '', email: '', message: '' };
      },
      (error) => {
        console.error('Error submitting data:', error);
      }
    );
  }

  onRefresh() {
    if (this.userData) {
      alert(
        `Thank you for contacting us, your data has reached us. Your data is: 
        Name: ${this.userData.name}, 
        Email: ${this.userData.email}, 
        Message: ${this.userData.message}`
      );
    } else {
      alert('No data to display. Please submit the form first.');
    }
  }
}
