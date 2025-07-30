import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private readonly DATABASE_URL = 'https://upskillbro-app-default-rtdb.firebaseio.com';
  
  constructor(private http: HttpClient) {}

  // Create user
  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.DATABASE_URL}/users.json`, userData);
  }

  // Get user by email
  getUsers(): Observable<any> {
    return this.http.get(`${this.DATABASE_URL}/users.json`);
  }

  // Update user
  updateUser(userId: string, data: any): Observable<any> {
    return this.http.patch(`${this.DATABASE_URL}/users/${userId}.json`, data);
  }

  // Save roadmap
  saveRoadmap(roadmapData: any): Observable<any> {
    return this.http.post(`${this.DATABASE_URL}/roadmaps.json`, roadmapData);
  }

  // Save assessment
  saveAssessment(assessmentData: any): Observable<any> {
    return this.http.post(`${this.DATABASE_URL}/assessments.json`, assessmentData);
  }
}