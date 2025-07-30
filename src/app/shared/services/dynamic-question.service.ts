import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question, QuestionnaireResponse } from '../models/questionnaire.models';

interface DynamicQuestion {
  question_id: string;
  category: 'skill_validation' | 'learning_style' | 'reality_check' | 'role_specific' | 'commitment';
  type: 'single_select' | 'multi_select' | 'scale' | 'text';
  title: string;
  subtitle: string;
  options?: string[];
  follow_up?: string;
  weight: 'high' | 'medium' | 'low';
}

interface AIResponse {
  contextual_questions: DynamicQuestion[];
  reasoning: string;
}

@Injectable({
  providedIn: 'root'
})
export class DynamicQuestionService {
  private readonly HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
  private readonly API_KEY = 'your_huggingface_api_key_here'; // Replace with actual key

  constructor(private http: HttpClient) {}

  async generateDynamicQuestions(response: QuestionnaireResponse): Promise<Question[]> {
    const prompt = this.buildPrompt(response);
    
    try {
      // Try AI generation first
      const aiResponse = await this.callHuggingFaceAPI(prompt);
      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.error('AI generation failed, using fallback:', error);
      // Fallback to rule-based generation
      return this.generateFallbackQuestions(response);
    }
  }

  private buildPrompt(response: QuestionnaireResponse): string {
    const responses = response.responses;
    
    return `ROLE: You are an expert IT career counselor and assessment designer with 15+ years of experience in tech talent development.

TASK: Generate 3-5 personalized follow-up questions based on the user's assessment responses.

INPUT DATA:
- Target Role: ${responses['role'] || 'Not specified'}
- Experience Level: ${responses['experience'] || 'Not specified'}
- Current Skills: ${JSON.stringify(responses['skills'] || [])}
- Skill Level: ${responses['skill_level'] || 'Not specified'}/10
- Timeline Goal: ${responses['timeline'] || 'Not specified'}
- Current Salary: ${responses['current_salary'] || 'Not specified'}
- Target Salary: ${responses['target_salary'] || 'Not specified'}
- Domain: ${responses['domain'] || 'Not specified'}

Generate 3-5 contextual questions that will help create a more accurate career roadmap. Focus on:
1. Skill validation and confidence
2. Learning preferences and obstacles
3. Realistic timeline and commitment
4. Industry preferences
5. Hidden motivations

Return JSON format:
{
  "contextual_questions": [
    {
      "question_id": "unique_id",
      "category": "skill_validation",
      "type": "single_select",
      "title": "Question text",
      "subtitle": "Why this matters",
      "options": ["option1", "option2"],
      "weight": "high"
    }
  ],
  "reasoning": "Why these questions were chosen"
}`;
  }

  private async callHuggingFaceAPI(prompt: string): Promise<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.API_KEY}`,
      'Content-Type': 'application/json'
    });

    const body = {
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        return_full_text: false
      }
    };

    return this.http.post(this.HF_API_URL, body, { headers }).toPromise();
  }

  private parseAIResponse(aiResponse: any): Question[] {
    try {
      // Extract JSON from AI response
      const responseText = aiResponse[0]?.generated_text || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed: AIResponse = JSON.parse(jsonMatch[0]);
        return this.convertToQuestions(parsed.contextual_questions);
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }
    
    throw new Error('Failed to parse AI response');
  }

  private convertToQuestions(dynamicQuestions: DynamicQuestion[]): Question[] {
    return dynamicQuestions.map((dq, index) => ({
      id: dq.question_id,
      step: 9 + index, // Start after initial 8 steps
      type: dq.type,
      category: dq.category,
      title: dq.title,
      description: dq.subtitle,
      required: dq.weight === 'high',
      options: dq.options?.map(opt => ({ value: opt, label: opt })) || [],
      validation: dq.type === 'scale' ? { min: 1, max: 10 } : undefined
    }));
  }

  private generateFallbackQuestions(response: QuestionnaireResponse): Question[] {
    const responses = response.responses;
    const questions: Question[] = [];
    
    // Role-specific questions
    if (responses['role'] === 'frontend') {
      questions.push({
        id: 'frontend_focus',
        step: 9,
        type: 'single_select',
        category: 'Role Specific',
        title: 'What aspect of frontend development excites you most?',
        description: 'This helps us tailor your learning path',
        required: true,
        options: [
          { value: 'ui_design', label: 'UI Design & User Experience' },
          { value: 'performance', label: 'Performance Optimization' },
          { value: 'frameworks', label: 'Modern Frameworks & Libraries' },
          { value: 'accessibility', label: 'Accessibility & Inclusive Design' }
        ]
      });
    }

    // Skill validation based on self-rating
    const skillLevel = parseInt(responses['skill_level']) || 5;
    if (skillLevel >= 7) {
      questions.push({
        id: 'skill_validation',
        step: 10,
        type: 'text',
        category: 'Skill Validation',
        title: `You rated yourself ${skillLevel}/10. Describe a challenging project you've completed recently.`,
        description: 'Help us understand your practical experience',
        required: true
      });
    }

    // Timeline reality check
    if (responses['timeline'] === '3-months' || responses['timeline'] === '6-months') {
      questions.push({
        id: 'timeline_commitment',
        step: 11,
        type: 'single_select',
        category: 'Reality Check',
        title: 'How many hours per day can you realistically dedicate to learning?',
        description: 'Honest assessment helps create achievable milestones',
        required: true,
        options: [
          { value: '1-2', label: '1-2 hours (part-time)' },
          { value: '3-4', label: '3-4 hours (dedicated)' },
          { value: '5-6', label: '5-6 hours (intensive)' },
          { value: '8+', label: '8+ hours (full-time focus)' }
        ]
      });
    }

    // Learning style preference
    questions.push({
      id: 'learning_style',
      step: 12,
      type: 'single_select',
      category: 'Learning Style',
      title: 'When learning something completely new, what works best for you?',
      description: 'We\'ll recommend resources that match your learning style',
      required: true,
      options: [
        { value: 'hands_on', label: 'Jump in and build projects immediately' },
        { value: 'theory_first', label: 'Study theory and concepts first' },
        { value: 'guided', label: 'Follow structured courses step-by-step' },
        { value: 'community', label: 'Learn with others in groups/communities' }
      ]
    });

    // Commitment validation
    questions.push({
      id: 'biggest_concern',
      step: 13,
      type: 'single_select',
      category: 'Commitment',
      title: 'What\'s your biggest concern about achieving your career goal?',
      description: 'Understanding obstacles helps us provide better support',
      required: true,
      options: [
        { value: 'time', label: 'Not having enough time to learn' },
        { value: 'difficulty', label: 'Technical concepts being too difficult' },
        { value: 'competition', label: 'Too much competition in the job market' },
        { value: 'imposter', label: 'Feeling like I don\'t belong in tech' },
        { value: 'financial', label: 'Financial pressure during transition' }
      ]
    });

    return questions;
  }

  // Analyze responses for roadmap personalization
  analyzeDynamicResponses(responses: { [key: string]: any }): any {
    const insights = {
      learning_style: responses['learning_style'] || 'hands_on',
      commitment_level: this.assessCommitmentLevel(responses),
      risk_factors: this.identifyRiskFactors(responses),
      personalization_flags: this.getPersonalizationFlags(responses)
    };

    return insights;
  }

  private assessCommitmentLevel(responses: any): 'high' | 'medium' | 'low' {
    const timeCommitment = responses.timeline_commitment;
    const concerns = responses.biggest_concern;
    
    if (timeCommitment === '8+' && concerns !== 'time') return 'high';
    if (timeCommitment === '5-6' || timeCommitment === '3-4') return 'medium';
    return 'low';
  }

  private identifyRiskFactors(responses: any): string[] {
    const risks = [];
    
    if (responses.biggest_concern === 'time') risks.push('time_management');
    if (responses.biggest_concern === 'difficulty') risks.push('technical_confidence');
    if (responses.biggest_concern === 'imposter') risks.push('confidence_building');
    if (responses.timeline_commitment === '1-2') risks.push('limited_time');
    
    return risks;
  }

  private getPersonalizationFlags(responses: any): any {
    return {
      needs_confidence_building: responses.biggest_concern === 'imposter',
      prefers_community_learning: responses.learning_style === 'community',
      needs_time_management: responses.biggest_concern === 'time',
      high_achiever: responses.timeline_commitment === '8+',
      theory_focused: responses.learning_style === 'theory_first'
    };
  }
}