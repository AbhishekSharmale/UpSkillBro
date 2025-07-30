import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HuggingFaceService {
  private readonly API_URL = 'https://api-inference.huggingface.co/models';
  private readonly API_KEY = 'hf_your_api_key_here'; // Replace with your HF API key

  constructor(private http: HttpClient) {}

  generateRoadmap(assessmentData: any): Observable<any> {
    const prompt = this.createRoadmapPrompt(assessmentData);
    
    return this.http.post(
      `${this.API_URL}/microsoft/DialoGPT-medium`,
      { inputs: prompt },
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        })
      }
    );
  }

  private createRoadmapPrompt(data: any): string {
    return `Create a detailed career roadmap for:
Role: ${data.currentRole}
Experience: ${data.experience}
Current Salary: ${data.currentSalary}
Target Salary: ${data.targetSalary}
Skills: ${data.skills.join(', ')}
Timeline: ${data.timeline}

Generate a step-by-step roadmap with:
1. Skill gaps to fill
2. Learning milestones
3. Salary progression targets
4. Timeline for each step
5. Recommended resources

Format as JSON with milestones array.`;
  }

  // Fallback: Generate roadmap without API
  generateOfflineRoadmap(assessmentData: any): any {
    const roadmap = {
      title: `${assessmentData.currentRole} to ${assessmentData.targetSalary} Career Path`,
      currentSalary: assessmentData.currentSalary,
      targetSalary: assessmentData.targetSalary,
      timeline: assessmentData.timeline,
      milestones: this.createMilestones(assessmentData)
    };

    return roadmap;
  }

  private createMilestones(data: any): any[] {
    const milestones = [];
    const skillGaps = this.identifySkillGaps(data);
    
    // Milestone 1: Foundation
    milestones.push({
      id: 1,
      title: 'Foundation Building',
      duration: '2-3 months',
      salaryImpact: '+10%',
      skills: skillGaps.foundation,
      tasks: [
        'Complete core technology fundamentals',
        'Build 2-3 portfolio projects',
        'Set up professional profiles'
      ],
      resources: ['Documentation', 'Online courses', 'Practice projects']
    });

    // Milestone 2: Intermediate
    milestones.push({
      id: 2,
      title: 'Skill Enhancement',
      duration: '3-4 months',
      salaryImpact: '+20%',
      skills: skillGaps.intermediate,
      tasks: [
        'Master advanced concepts',
        'Contribute to open source',
        'Network with professionals'
      ],
      resources: ['Advanced courses', 'Mentorship', 'Community involvement']
    });

    // Milestone 3: Advanced
    milestones.push({
      id: 3,
      title: 'Career Advancement',
      duration: '4-6 months',
      salaryImpact: '+30%',
      skills: skillGaps.advanced,
      tasks: [
        'Lead projects',
        'Develop leadership skills',
        'Prepare for senior roles'
      ],
      resources: ['Leadership training', 'Industry certifications', 'Speaking opportunities']
    });

    return milestones;
  }

  private identifySkillGaps(data: any): any {
    const roleSkills: { [key: string]: any } = {
      'Frontend Developer': {
        foundation: ['HTML/CSS', 'JavaScript', 'React/Vue'],
        intermediate: ['TypeScript', 'State Management', 'Testing'],
        advanced: ['Performance Optimization', 'Architecture', 'Team Leadership']
      },
      'Backend Developer': {
        foundation: ['Programming Language', 'Databases', 'APIs'],
        intermediate: ['System Design', 'Security', 'DevOps'],
        advanced: ['Microservices', 'Scalability', 'Technical Leadership']
      },
      'Full Stack Developer': {
        foundation: ['Frontend Basics', 'Backend Basics', 'Database Design'],
        intermediate: ['Full Stack Frameworks', 'Cloud Services', 'CI/CD'],
        advanced: ['System Architecture', 'Performance', 'Team Management']
      }
    };

    return roleSkills[data.currentRole] || roleSkills['Full Stack Developer'];
  }
}