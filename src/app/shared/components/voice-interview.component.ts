import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoiceAIService } from '../services/voice-ai.service';

@Component({
  selector: 'app-voice-interview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="voice-interview">
      <div class="interview-header">
        <h3>🎤 Voice Mock Interview</h3>
        <p>Practice with AI interviewer using voice interaction</p>
      </div>
      
      <div class="interview-status">
        <div class="status-indicator" [class.active]="isInterviewActive">
          <div class="pulse-ring" *ngIf="isInterviewActive"></div>
          <div class="status-icon">
            {{isInterviewActive ? '🔴' : '⚪'}}
          </div>
        </div>
        <span class="status-text">
          {{getStatusText()}}
        </span>
      </div>
      
      <div class="conversation-area">
        <div class="message interviewer" *ngFor="let msg of conversation" 
             [class.user]="msg.type === 'user'">
          <div class="message-avatar">
            {{msg.type === 'interviewer' ? '👨‍💼' : '👤'}}
          </div>
          <div class="message-content">
            <div class="message-text">{{msg.text}}</div>
            <div class="message-time">{{msg.time | date:'short'}}</div>
          </div>
        </div>
        
        <div class="listening-indicator" *ngIf="isListening">
          <div class="sound-wave">
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
          </div>
          <span>Listening...</span>
        </div>
      </div>
      
      <div class="interview-controls">
        <button 
          class="control-btn start-btn" 
          (click)="startInterview()"
          [disabled]="isInterviewActive"
          *ngIf="!isInterviewActive">
          🚀 Start Interview
        </button>
        
        <div class="active-controls" *ngIf="isInterviewActive">
          <button 
            class="control-btn listen-btn" 
            (click)="startListening()"
            [disabled]="isListening || isSpeaking">
            🎤 {{isListening ? 'Listening...' : 'Speak Answer'}}
          </button>
          
          <button 
            class="control-btn skip-btn" 
            (click)="skipQuestion()"
            [disabled]="isListening || isSpeaking">
            ⏭️ Skip
          </button>
          
          <button 
            class="control-btn stop-btn" 
            (click)="stopInterview()">
            ⏹️ End Interview
          </button>
        </div>
      </div>
      
      <div class="interview-tips" *ngIf="!isInterviewActive">
        <h4>💡 Tips for Voice Interview:</h4>
        <ul>
          <li>Speak clearly and at moderate pace</li>
          <li>Find a quiet environment</li>
          <li>Allow microphone access when prompted</li>
          <li>Take your time to think before answering</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .voice-interview {
      background: var(--background-white);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: var(--card-shadow);
      max-width: 600px;
      margin: 0 auto;
    }

    .interview-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .interview-header h3 {
      margin: 0 0 0.5rem 0;
      color: var(--primary-blue);
    }

    .interview-header p {
      margin: 0;
      color: var(--secondary-gray);
      font-size: 0.9rem;
    }

    .interview-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 1rem;
      background: var(--light-gray-bg);
      border-radius: 8px;
    }

    .status-indicator {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pulse-ring {
      position: absolute;
      width: 40px;
      height: 40px;
      border: 2px solid #ff4444;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.5); opacity: 0; }
    }

    .status-icon {
      font-size: 1.5rem;
      z-index: 2;
    }

    .status-text {
      font-weight: 600;
      color: var(--black-text);
    }

    .conversation-area {
      min-height: 300px;
      max-height: 400px;
      overflow-y: auto;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .message {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      
      &.user {
        flex-direction: row-reverse;
        
        .message-content {
          background: var(--primary-blue);
          color: white;
        }
      }
    }

    .message-avatar {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--background-white);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .message-content {
      background: var(--background-white);
      padding: 1rem;
      border-radius: 12px;
      max-width: 70%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .message-text {
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }

    .message-time {
      font-size: 0.7rem;
      opacity: 0.7;
    }

    .listening-indicator {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
      padding: 1rem;
      color: var(--primary-blue);
      font-weight: 600;
    }

    .sound-wave {
      display: flex;
      gap: 2px;
    }

    .wave {
      width: 3px;
      height: 20px;
      background: var(--primary-blue);
      border-radius: 2px;
      animation: wave 1s infinite;
    }

    .wave:nth-child(2) { animation-delay: 0.1s; }
    .wave:nth-child(3) { animation-delay: 0.2s; }
    .wave:nth-child(4) { animation-delay: 0.3s; }

    @keyframes wave {
      0%, 100% { height: 20px; }
      50% { height: 5px; }
    }

    .interview-controls {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .active-controls {
      display: flex;
      gap: 1rem;
    }

    .control-btn {
      padding: 1rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .start-btn {
      background: var(--primary-gradient);
      color: white;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 56, 255, 0.3);
      }
    }

    .listen-btn {
      background: #10b981;
      color: white;
      
      &:hover:not(:disabled) {
        background: #059669;
      }
    }

    .stop-btn {
      background: #ef4444;
      color: white;
      
      &:hover {
        background: #dc2626;
      }
    }
    
    .skip-btn {
      background: #f59e0b;
      color: white;
      
      &:hover {
        background: #d97706;
      }
    }

    .interview-tips {
      background: #fef3c7;
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid #f59e0b;
    }

    .interview-tips h4 {
      margin: 0 0 0.5rem 0;
      color: #92400e;
    }

    .interview-tips ul {
      margin: 0;
      padding-left: 1.5rem;
      color: #92400e;
    }

    .interview-tips li {
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }
  `]
})
export class VoiceInterviewComponent implements OnDestroy {
  isInterviewActive = false;
  isListening = false;
  isSpeaking = false;
  conversation: any[] = [];
  
  currentQuestion = '';
  questionIndex = 0;
  
  questions = [
    "Tell me about yourself and your background in programming.",
    "What programming languages and technologies are you most comfortable with?",
    "Describe a challenging project you've worked on recently and how you solved the problems.",
    "How do you approach learning new technologies and staying updated?",
    "Walk me through your problem-solving process when you encounter a bug."
  ];

  constructor(private voiceAI: VoiceAIService) {}

  ngOnDestroy() {
    this.stopInterview();
  }

  getStatusText(): string {
    if (!this.isInterviewActive) return 'Ready to start';
    if (this.isSpeaking) return 'AI is speaking...';
    if (this.isListening) return 'Listening to your answer...';
    return 'Waiting for your response';
  }

  async startInterview() {
    this.isInterviewActive = true;
    this.conversation = [];
    this.questionIndex = 0;
    
    await this.askNextQuestion();
  }

  async askNextQuestion() {
    if (this.questionIndex >= this.questions.length) {
      await this.endInterview();
      return;
    }

    this.currentQuestion = this.questions[this.questionIndex];
    
    this.conversation.push({
      type: 'interviewer',
      text: this.currentQuestion,
      time: new Date()
    });

    this.isSpeaking = true;
    await this.voiceAI.speak(this.currentQuestion, 'interviewer');
    this.isSpeaking = false;
  }

  async startListening() {
    try {
      this.isListening = true;
      const userAnswer = await this.voiceAI.startListening();
      
      if (userAnswer && userAnswer.trim()) {
        this.conversation.push({
          type: 'user',
          text: userAnswer,
          time: new Date()
        });

        this.isSpeaking = true;
        const response = await this.voiceAI.generateInterviewResponse(this.currentQuestion, userAnswer);
        
        this.conversation.push({
          type: 'interviewer',
          text: response,
          time: new Date()
        });

        await this.voiceAI.speak(response, 'interviewer');
        this.isSpeaking = false;
        
        // Check if this was a follow-up or should move to next question
        if (this.shouldMoveToNextQuestion(response)) {
          this.questionIndex++;
          setTimeout(() => this.askNextQuestion(), 2000);
        } else {
          // Stay on current question for follow-up
          setTimeout(() => {
            if (!this.isListening && !this.isSpeaking) {
              // Auto-prompt for next answer if user doesn't respond
              this.conversation.push({
                type: 'interviewer',
                text: 'Please continue with your answer or click the microphone to respond.',
                time: new Date()
              });
            }
          }, 5000);
        }
      } else {
        this.isListening = false;
        this.showError('No speech detected. Please try again.');
      }
      
    } catch (error: any) {
      console.error('Speech recognition error:', error);
      this.isListening = false;
      this.showError(error.toString());
      
      // Auto-retry or move forward after error
      setTimeout(() => {
        if (!this.isListening && !this.isSpeaking && this.isInterviewActive) {
          this.conversation.push({
            type: 'interviewer',
            text: 'Let\'s try a different question. Click the microphone when ready.',
            time: new Date()
          });
        }
      }, 2000);
    }
  }

  async endInterview() {
    const endMessage = "Thank you for the interview! You did great. Good luck with your job search!";
    
    this.conversation.push({
      type: 'interviewer',
      text: endMessage,
      time: new Date()
    });

    this.isSpeaking = true;
    await this.voiceAI.speak(endMessage, 'system');
    this.isSpeaking = false;
    
    this.isInterviewActive = false;
  }

  stopInterview() {
    // Force stop everything
    this.voiceAI.stopListening();
    this.voiceAI.stopSpeaking();
    
    // Reset all states
    this.isInterviewActive = false;
    this.isListening = false;
    this.isSpeaking = false;
    
    // Clear any pending timeouts
    setTimeout(() => {
      this.conversation.push({
        type: 'interviewer',
        text: 'Interview ended. Thank you for your time!',
        time: new Date()
      });
    }, 500);
  }
  
  private showError(message: string) {
    this.conversation.push({
      type: 'interviewer',
      text: `⚠️ ${message}`,
      time: new Date()
    });
  }
  
  skipQuestion() {
    // Stop any ongoing speech recognition
    this.voiceAI.stopListening();
    this.isListening = false;
    
    this.conversation.push({
      type: 'user',
      text: '[Question skipped]',
      time: new Date()
    });
    
    this.questionIndex++;
    setTimeout(() => this.askNextQuestion(), 1000);
  }
  
  private shouldMoveToNextQuestion(response: string): boolean {
    // Move to next question if response seems like a conclusion
    const conclusionWords = ['next', 'move on', 'continue', 'great', 'excellent', 'perfect'];
    const lowerResponse = response.toLowerCase();
    
    return conclusionWords.some(word => lowerResponse.includes(word)) || 
           lowerResponse.includes('let\'s') ||
           lowerResponse.includes('now');
  }
}