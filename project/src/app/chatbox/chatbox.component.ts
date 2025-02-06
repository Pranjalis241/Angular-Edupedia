import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { GoogleGenerativeAI } from "@google/generative-ai";
@Component({
  selector: 'app-chatbox',
  standalone: false,
  
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css'
})
export class ChatboxComponent {
  userInput: string = '';
  chatHistory: { sender: string, message: string }[] = [];
  private genAI = new GoogleGenerativeAI('AIzaSyDURlxLZ9x0cUlnZ_wBn8tX14JjCYoFqvs');
  private model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message to chat history
    this.chatHistory.push({ sender: 'You', message: this.userInput });

    const websiteContext = `
    You are the AI chatbot for Edupedia, an IT learning platform. Only provide information related to this website. 
    Here are the website details:
    - Name: Edupedia
    - About: Edupedia offers high-quality IT courses designed to help learners upskill and achieve their career goals.
    - Contact: 
      - Email: edupedia.com
      - Phone: +91 9972143214
      - Address: Bangalore, India.
    - Available Features:
      - Students can buy courses.
      - Trainers can add courses.
      - Admins can manage students and trainers.
      - Dashboards provide insights using bar and pie charts.
    - Courses Offered:
      1. **Artificial Intelligence** – Fundamentals of AI, ML, NLP, and applications.
      2. **Cloud Computing** – Concepts and services like AWS, Azure, and Google Cloud.
      3. **Machine Learning** – Supervised/unsupervised learning, neural networks, deep learning.
      4. **Cybersecurity** – Cryptography, network security, and risk management.
      5. **Data Analytics** – Data mining, visualization, big data technologies like Hadoop and Spark.
      6. **Computer Networks** – TCP/IP, wireless networks, and troubleshooting.

    - Free Courses:
      1. **DSA in C++** – Master the Coding Interview by learning Data Structures & Algorithms (Author: Priya Sharma).
      2. **Python Basics** – Learn Python programming from scratch, perfect for beginners (Author: Raman Singh).
      3. **Web Development** – Dive into the world of web development with this hands-on course (Author: Shreya Gupta).

    If a user asks a question unrelated to Edupedia, politely inform them that you can only answer questions about the platform.
  `;

    try {
      const result = await this.model.generateContent(websiteContext + "\n\nUser: " + this.userInput);
      const aiResponse = result.response.text();

      // Add AI message to chat history
      this.chatHistory.push({ sender: 'AI', message: aiResponse });

    } catch (error) {
      console.error('Error generating response:', error);
      this.chatHistory.push({ sender: 'AI', message: 'Error fetching response.' });
    }

    // Clear input field
    this.userInput = '';
  }
}
