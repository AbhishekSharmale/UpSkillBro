import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MongoDBService {
  private readonly API_URL = 'https://us-east-1.aws.data.mongodb-api.com/app/data-xxxxx/endpoint/data/v1';
  private readonly API_KEY = '90ef5fb2-6d5a-400a-a1b0-043cef91c0f3';
  private readonly DATABASE = 'upskillbro';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'api-key': this.API_KEY
    });
  }

  // User Authentication
  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/action/insertOne`, {
      collection: 'users',
      database: this.DATABASE,
      document: {
        ...userData,
        createdAt: new Date(),
        lastLogin: new Date()
      }
    }, { headers: this.getHeaders() });
  }

  findUser(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/action/findOne`, {
      collection: 'users',
      database: this.DATABASE,
      filter: { email: email }
    }, { headers: this.getHeaders() });
  }

  updateUserProgress(userId: string, progressData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/action/updateOne`, {
      collection: 'users',
      database: this.DATABASE,
      filter: { _id: { $oid: userId } },
      update: { $set: progressData }
    }, { headers: this.getHeaders() });
  }

  // Save user roadmap
  saveRoadmap(userId: string, roadmapData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/action/insertOne`, {
      collection: 'roadmaps',
      database: this.DATABASE,
      document: {
        userId: userId,
        ...roadmapData,
        createdAt: new Date()
      }
    }, { headers: this.getHeaders() });
  }

  // Get user roadmaps
  getUserRoadmaps(userId: string): Observable<any> {
    return this.http.post(`${this.API_URL}/action/find`, {
      collection: 'roadmaps',
      database: this.DATABASE,
      filter: { userId: userId }
    }, { headers: this.getHeaders() });
  }

  // Save assessment results
  saveAssessment(userId: string, assessmentData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/action/insertOne`, {
      collection: 'assessments',
      database: this.DATABASE,
      document: {
        userId: userId,
        ...assessmentData,
        completedAt: new Date()
      }
    }, { headers: this.getHeaders() });
  }

  // Save interview session
  saveInterviewSession(userId: string, sessionData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/action/insertOne`, {
      collection: 'interviews',
      database: this.DATABASE,
      document: {
        userId: userId,
        ...sessionData,
        completedAt: new Date()
      }
    }, { headers: this.getHeaders() });
  }
}