import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: false,
  
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  faqs = [
    {
      question: 'How do I enroll in a course?',
      answer: 'To enroll in a course, visit our Courses page, select the course you\'re interested in, and click the "Enroll Now" button. Follow the instructions to complete your enrollment.',
      active: false
    },
    {question: 'How can I contact support?',
      answer: 'You can contact our support team by clicking on the "Contact Us" link at the bottom of the page. Fill out the contact form, and our team will get back to you within 24 hours.',
      active: false
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including credit/debit cards, PayPal, and bank transfers. You can choose your preferred payment method during the checkout process.',
      active: false
    },
    {
      question: 'Can I get a refund?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with the course, you can request a refund within 30 days of purchase. Please refer to our Refund Policy for more details.',
      active: false
    },
    {
      question: 'Do you offer any discounts?',
      answer: 'We occasionally offer discounts and promotions. Subscribe to our newsletter or follow us on social media to stay updated on the latest offers.',
      active: false
    }
  ];

 togglePanel(faq: any) {
  // Close all other panels (optional, if you want only one open at a time)
  this.faqs.forEach(item => {
    if (item !== faq) item.active = false;
  });

  // Toggle the current panel
  faq.active = !faq.active;
}
}
