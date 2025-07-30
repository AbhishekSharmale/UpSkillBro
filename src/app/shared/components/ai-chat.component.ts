import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HuggingFaceService } from '../services/huggingface.service';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-chat">
      <div class="chat-header">
        <h3>🤖 AI Learning Assistant</h3>
        <p>Ask me anything about programming!</p>
      </div>
      
      <div class="chat-messages">
        <div class="message" *ngFor="let msg of messages" [class.user]="msg.isUser">
          <div class="message-content">{{msg.content}}</div>
          <div class="message-time">{{msg.time | date:'short'}}</div>
        </div>
        
        <div class="typing" *ngIf="isTyping">
          <span></span><span></span><span></span>
        </div>
      </div>
      
      <div class="chat-input">
        <input 
          [(ngModel)]="currentMessage" 
          (keyup.enter)="sendMessage()"
          placeholder="Ask about coding, career advice, or learning tips..."
          [disabled]="isTyping">
        <button (click)="sendMessage()" [disabled]="!currentMessage.trim() || isTyping">
          Send
        </button>
      </div>
    </div>
  `,
  styles: [`
    .ai-chat {
      background: var(--background-white);
      border-radius: 12px;
      box-shadow: var(--card-shadow);
      height: 400px;
      display: flex;
      flex-direction: column;
    }

    .chat-header {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      text-align: center;
    }

    .chat-header h3 {
      margin: 0 0 0.5rem 0;
      color: var(--primary-blue);
    }

    .chat-header p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--secondary-gray);
    }

    .chat-messages {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message {
      max-width: 80%;
      align-self: flex-start;
    }

    .message.user {
      align-self: flex-end;
    }

    .message-content {
      padding: 0.75rem 1rem;
      border-radius: 12px;
      background: var(--light-gray-bg);
      color: var(--black-text);
    }

    .message.user .message-content {
      background: var(--primary-gradient);
      color: white;
    }

    .message-time {
      font-size: 0.7rem;
      color: var(--secondary-gray);
      margin-top: 0.25rem;
      text-align: right;
    }

    .message.user .message-time {
      text-align: left;
    }

    .typing {
      display: flex;
      gap: 0.25rem;
      padding: 0.75rem 1rem;
      background: var(--light-gray-bg);
      border-radius: 12px;
      width: fit-content;
    }

    .typing span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--secondary-gray);
      animation: typing 1.4s infinite;
    }

    .typing span:nth-child(2) { animation-delay: 0.2s; }
    .typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }

    .chat-input {
      display: flex;
      padding: 1rem;
      border-top: 1px solid var(--border-color);
      gap: 0.5rem;
    }

    .chat-input input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      outline: none;
    }

    .chat-input button {
      padding: 0.75rem 1.5rem;
      background: var(--primary-gradient);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    .chat-input button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class AIChatComponent {
  messages: any[] = [
    {
      content: "Hi! I'm your AI learning assistant. I can help you with programming questions, career advice, and learning tips. What would you like to know?",
      isUser: false,
      time: new Date()
    }
  ];
  
  currentMessage = '';
  isTyping = false;

  constructor(private huggingFace: HuggingFaceService) {}

  async sendMessage() {
    if (!this.currentMessage.trim()) return;

    // Add user message
    this.messages.push({
      content: this.currentMessage,
      isUser: true,
      time: new Date()
    });

    const userMessage = this.currentMessage;
    this.currentMessage = '';
    this.isTyping = true;

    try {
      // Simple response logic - in production, use HuggingFace API
      const response = await this.generateResponse(userMessage);
      
      setTimeout(() => {
        this.messages.push({
          content: response,
          isUser: false,
          time: new Date()
        });
        this.isTyping = false;
      }, 1500);
      
    } catch (error) {
      this.messages.push({
        content: "Sorry, I'm having trouble right now. Please try again later!",
        isUser: false,
        time: new Date()
      });
      this.isTyping = false;
    }
  }

  private async generateResponse(message: string): Promise<string> {
    // Mock responses for demo - replace with HuggingFace API call
    const responses = [
      "That's a great question! Here's what I think...",
      "Based on current industry trends, I'd recommend...",
      "Let me break this down for you step by step...",
      "Here's a practical approach you can try...",
      "That's a common challenge. Here's how to tackle it..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + " " + 
           "For more detailed help, I'd suggest checking out the specific learning modules in your roadmap!";
  }
}