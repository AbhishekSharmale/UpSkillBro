import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = 'https://gvenjrlppbzpigovcfsa.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2ZW5qcmxwcGJ6cGlnb3ZjZnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTczNTQsImV4cCI6MjA2OTQ3MzM1NH0.IfrS7GHIgw7gY0KUiussgnKgP44dRbgBIgMufifBXPU';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // User Management
  async createUser(userData: any) {
    const { data, error } = await this.supabase
      .from('users')
      .insert([{
        uid: userData.uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        auth_method: userData.authMethod,
        photo_url: userData.photoURL,
        is_guest: userData.isGuest || false,
        level: 1,
        xp: 0,
        streak: 0,
        total_points: 0,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async getUser(uid: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('uid', uid)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateUser(uid: string, updates: any) {
    const { data, error } = await this.supabase
      .from('users')
      .update({
        ...updates,
        last_login: new Date().toISOString()
      })
      .eq('uid', uid)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  // Assessment Management
  async saveAssessment(uid: string, assessmentData: any) {
    const { data, error } = await this.supabase
      .from('assessments')
      .insert([{
        user_id: uid,
        responses: assessmentData.responses,
        current_step: assessmentData.currentStep,
        total_steps: assessmentData.totalSteps,
        completed: assessmentData.completed || false,
        completed_at: assessmentData.completed ? new Date().toISOString() : null,
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async getLatestAssessment(uid: string) {
    const { data, error } = await this.supabase
      .from('assessments')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateAssessment(assessmentId: string, updates: any) {
    const { data, error } = await this.supabase
      .from('assessments')
      .update(updates)
      .eq('id', assessmentId)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  // Roadmap Management
  async saveRoadmap(uid: string, roadmapData: any) {
    const { data, error } = await this.supabase
      .from('roadmaps')
      .insert([{
        user_id: uid,
        title: roadmapData.title,
        current_salary: roadmapData.currentSalary,
        target_salary: roadmapData.targetSalary,
        timeline: roadmapData.timeline,
        milestones: roadmapData.milestones,
        progress: 0,
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async getRoadmap(uid: string) {
    const { data, error } = await this.supabase
      .from('roadmaps')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateRoadmapProgress(roadmapId: string, progress: number) {
    const { data, error } = await this.supabase
      .from('roadmaps')
      .update({ progress, updated_at: new Date().toISOString() })
      .eq('id', roadmapId)
      .select();
    
    if (error) throw error;
    return data[0];
  }

  // Get all users for hiring platform
  async getAllUsers(filters: any = {}) {
    let query = this.supabase
      .from('users')
      .select(`
        *,
        assessments!inner(completed, responses),
        roadmaps(title, progress)
      `)
      .eq('assessments.completed', true)
      .eq('is_guest', false);

    if (filters.role) {
      query = query.contains('assessments.responses', { role: filters.role });
    }

    if (filters.experience) {
      query = query.contains('assessments.responses', { experience: filters.experience });
    }

    const { data, error } = await query.order('last_login', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}