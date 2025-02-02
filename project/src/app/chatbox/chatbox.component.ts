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

    try {
      const result = await this.model.generateContent(this.userInput);
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
