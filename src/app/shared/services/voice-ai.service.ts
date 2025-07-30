import { Injectable } from '@angular/core';
import { HuggingFaceService } from './huggingface.service';

@Injectable({
  providedIn: 'root'
})
export class VoiceAIService {
  private recognition: any;
  private synthesis: SpeechSynthesis;
  private isListening = false;

  constructor(private huggingFace: HuggingFaceService) {
    this.synthesis = window.speechSynthesis;
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;
    }
  }

  // Text to Speech using Web Speech API (free and fast)
  speak(text: string, voice: 'interviewer' | 'system' = 'interviewer'): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices and select a professional one
      const voices = this.synthesis.getVoices();
      const preferredVoices = voices.filter(v => 
        v.lang.startsWith('en') && 
        (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Alex') || v.name.includes('Samantha'))
      );
      
      if (preferredVoices.length > 0) {
        utterance.voice = preferredVoices[0];
      }
      
      // Configure voice based on role with personality
      if (voice === 'interviewer') {
        // Professional, confident interviewer voice
        utterance.rate = 0.8;
        utterance.pitch = 0.85;
        utterance.volume = 0.95;
        
        // Try to get a professional male voice
        const professionalVoices = voices.filter(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Mark') || 
           v.name.includes('Daniel') || v.name.toLowerCase().includes('male'))
        );
        
        if (professionalVoices.length > 0) {
          utterance.voice = professionalVoices[0];
        }
      } else {
        // System voice - neutral and clear
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Try to get a neutral voice
        const neutralVoices = voices.filter(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Moira'))
        );
        
        if (neutralVoices.length > 0) {
          utterance.voice = neutralVoices[0];
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synthesis.speak(utterance);
    });
  }

  // Speech to Text using Web Speech API
  startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject('Speech recognition not supported in this browser');
        return;
      }

      // Reset recognition state
      this.stopListening();
      
      this.isListening = true;
      let finalTranscript = '';
      let resolved = false;

      this.recognition.onresult = (event: any) => {
        if (resolved) return;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        
        // If we have final results, resolve immediately
        if (finalTranscript && !resolved) {
          resolved = true;
          this.isListening = false;
          this.recognition.stop();
          resolve(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (event: any) => {
        if (resolved) return;
        
        console.error('Speech recognition error:', event.error);
        resolved = true;
        this.isListening = false;
        
        if (event.error === 'not-allowed') {
          reject('Microphone access denied. Please allow microphone access and try again.');
        } else if (event.error === 'no-speech') {
          reject('No speech detected. Please try speaking again.');
        } else {
          reject(`Speech recognition error: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        if (resolved) return;
        
        this.isListening = false;
        if (!finalTranscript) {
          resolved = true;
          reject('No speech was recognized. Please try again.');
        }
      };

      // Add timeout to prevent hanging
      setTimeout(() => {
        if (this.isListening && !resolved) {
          resolved = true;
          this.isListening = false;
          this.recognition.stop();
          if (finalTranscript) {
            resolve(finalTranscript.trim());
          } else {
            reject('Speech recognition timeout. Please try again.');
          }
        }
      }, 10000); // 10 second timeout

      try {
        this.recognition.start();
      } catch (error) {
        if (!resolved) {
          resolved = true;
          this.isListening = false;
          reject('Failed to start speech recognition. Please try again.');
        }
      }
    });
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.abort();
        this.recognition.stop();
      } catch (error) {
        // Ignore errors when stopping
      }
      this.isListening = false;
    }
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  // Generate interview response using Hugging Face
  async generateInterviewResponse(question: string, userAnswer: string): Promise<string> {
    const prompt = `Act as an experienced senior software engineer conducting a technical interview. You are intelligent, insightful, and ask probing questions.

Original Question: "${question}"
Candidate's Answer: "${userAnswer}"

Analyze their answer and respond as a smart interviewer would:
- If they mention specific technologies, ask about implementation details
- If they describe a project, ask about challenges and solutions
- If they give a surface-level answer, dig deeper
- Ask follow-up questions that test their real understanding

Provide ONE intelligent follow-up question (max 30 words):`;

    try {
      // Try multiple Hugging Face models for better responses
      const models = [
        'microsoft/DialoGPT-medium',
        'google/flan-t5-base',
        'facebook/blenderbot-400M-distill'
      ];
      
      for (const model of models) {
        try {
          const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer your_huggingface_api_key_here',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              inputs: prompt,
              parameters: {
                max_length: 80,
                temperature: 0.8,
                do_sample: true,
                top_p: 0.9
              }
            })
          });

          if (response.ok) {
            const result = await response.json();
            let aiResponse = result[0]?.generated_text || result.generated_text || '';
            
            // Clean up the response
            aiResponse = aiResponse.replace(prompt, '').trim();
            aiResponse = aiResponse.replace(/^(Response:|Answer:)/i, '').trim();
            
            if (aiResponse && aiResponse.length > 15 && aiResponse.includes('?')) {
              return aiResponse;
            }
          }
        } catch (modelError) {
          console.log(`Model ${model} failed, trying next...`);
        }
      }
      
      // Enhanced contextual responses
      return this.generateIntelligentResponse(question, userAnswer);
      
    } catch (error) {
      console.error('All AI models failed:', error);
      return this.generateIntelligentResponse(question, userAnswer);
    }
  }
  
  private generateIntelligentResponse(question: string, userAnswer: string): string {
    const answer = userAnswer.toLowerCase();
    const keyWords = this.extractKeywords(answer);
    
    // Advanced contextual analysis
    if (keyWords.includes('javascript') || keyWords.includes('js')) {
      const jsQuestions = [
        "Can you walk me through how closures work in JavaScript and give me a practical use case?",
        "How do you handle memory leaks in JavaScript applications?",
        "Explain the difference between == and === and when you'd use each.",
        "How would you implement debouncing without using a library?"
      ];
      return jsQuestions[Math.floor(Math.random() * jsQuestions.length)];
    }
    
    if (keyWords.includes('react')) {
      const reactQuestions = [
        "How do you prevent unnecessary re-renders in React components?",
        "Can you explain the virtual DOM and why React uses it?",
        "How would you implement error boundaries in a React application?",
        "What's your approach to testing React components?"
      ];
      return reactQuestions[Math.floor(Math.random() * reactQuestions.length)];
    }
    
    if (keyWords.includes('project') || keyWords.includes('built')) {
      return `Tell me about the architecture decisions you made in that project. What would you do differently now?`;
    }
    
    if (keyWords.includes('algorithm') || keyWords.includes('data')) {
      return "Can you analyze the time and space complexity of your solution?";
    }
    
    if (keyWords.includes('team') || keyWords.includes('collaborate')) {
      return "Describe a time when you had to convince your team to adopt a new technology or approach.";
    }
    
    if (keyWords.includes('performance') || keyWords.includes('optimize')) {
      return "What tools and techniques do you use to identify performance bottlenecks?";
    }
    
    if (keyWords.includes('database') || keyWords.includes('sql')) {
      return "How do you handle database migrations in a production environment?";
    }
    
    // Intelligent follow-ups based on answer length and depth
    if (answer.length < 30) {
      return "That's quite brief. Can you dive deeper and give me a specific example with technical details?";
    }
    
    if (answer.split(' ').length > 100) {
      return "Great detail! Now, if you had to explain the core concept to a non-technical stakeholder, how would you do it?";
    }
    
    // Smart generic responses
    const intelligentQuestions = [
      `You mentioned ${this.extractKeyPhrase(userAnswer)}. How does that scale in a high-traffic environment?`,
      "What trade-offs did you consider when making that technical decision?",
      "How do you ensure code maintainability when working on that type of solution?",
      "What would be your approach to testing that implementation?",
      "How would you monitor and debug issues in that system?"
    ];
    
    return intelligentQuestions[Math.floor(Math.random() * intelligentQuestions.length)];
  }
  
  private extractKeywords(text: string): string[] {
    const techKeywords = ['javascript', 'react', 'node', 'python', 'java', 'database', 'sql', 'api', 'algorithm', 'performance', 'team', 'project', 'built', 'developed', 'optimize', 'scale'];
    return techKeywords.filter(keyword => text.includes(keyword));
  }
  
  private extractKeyPhrase(text: string): string {
    const words = text.split(' ');
    const importantWords = words.filter(word => 
      word.length > 4 && 
      !['that', 'this', 'with', 'have', 'been', 'were', 'they', 'there', 'would', 'could', 'should'].includes(word.toLowerCase())
    );
    return importantWords[0] || 'that';
  }
}