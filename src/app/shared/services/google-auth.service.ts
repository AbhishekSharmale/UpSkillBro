import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getDatabase, ref, set, get, update } from 'firebase/database';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private app = initializeApp(environment.firebase);
  private auth = getAuth(this.app);
  private db = getDatabase(this.app);
  private provider = new GoogleAuthProvider();
  
  private currentUserSubject = new BehaviorSubject<any>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  
  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // Check for local user first
    this.checkLocalUser();
    
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.loadUserData(user);
      } else if (!this.isLoggedInSubject.value) {
        // Only clear if no local user exists
        this.currentUserSubject.next(null);
        this.isLoggedInSubject.next(false);
      }
    });
  }

  async signInWithGoogle(): Promise<boolean> {
    try {
      // Add scopes and custom parameters
      this.provider.addScope('email');
      this.provider.addScope('profile');
      this.provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(this.auth, this.provider);
      const user = result.user;
      
      if (user) {
        // Only handle Firebase auth, data will go to Supabase
        const userData = {
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email,
          phone: user.phoneNumber,
          authMethod: 'google',
          photoURL: user.photoURL,
          isGuest: false
        };
        
        // Store in localStorage for immediate use
        localStorage.setItem('current_user', JSON.stringify(userData));
        this.currentUserSubject.next(userData);
        this.isLoggedInSubject.next(true);
        
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Google sign-in failed:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Popup was closed by user');
        return false;
      }
      if (error.code === 'auth/popup-blocked') {
        console.log('Popup was blocked by browser');
        // Try redirect method as fallback
        return this.signInWithRedirect();
      }
      return false;
    }
  }
  
  private async signInWithRedirect(): Promise<boolean> {
    try {
      const { signInWithRedirect } = await import('firebase/auth');
      await signInWithRedirect(this.auth, this.provider);
      return true;
    } catch (error) {
      console.error('Redirect sign-in failed:', error);
      return false;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      localStorage.removeItem('current_user');
      localStorage.removeItem('assessment_completed');
      localStorage.removeItem('assessment_data');
      localStorage.removeItem('roadmap_data');
      this.currentUserSubject.next(null);
      this.isLoggedInSubject.next(false);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  private async createOrUpdateUser(firebaseUser: any): Promise<void> {
    await this.loadOrCreateUserData(firebaseUser);
  }

  private async loadUserData(firebaseUser: any): Promise<void> {
    const userRef = ref(this.db, `users/${firebaseUser.uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      this.currentUserSubject.next(snapshot.val());
      this.isLoggedInSubject.next(true);
    }
  }
  
  // Check for locally stored user on init
  checkLocalUser(): void {
    const localUser = localStorage.getItem('current_user');
    if (localUser) {
      const userData = JSON.parse(localUser);
      this.currentUserSubject.next(userData);
      this.isLoggedInSubject.next(true);
    }
  }

  async updateUserProgress(progressData: any): Promise<void> {
    const user = this.currentUserSubject.value;
    if (user && user.uid) {
      const userRef = ref(this.db, `users/${user.uid}`);
      await update(userRef, progressData);
      
      const updatedUser = { ...user, ...progressData };
      this.currentUserSubject.next(updatedUser);
    }
  }

  async saveRoadmap(roadmapData: any): Promise<void> {
    const user = this.currentUserSubject.value;
    if (user && user.uid) {
      const roadmapRef = ref(this.db, `users/${user.uid}/roadmaps/${Date.now()}`);
      await set(roadmapRef, { ...roadmapData, createdAt: new Date().toISOString() });
    }
  }

  async saveAssessment(assessmentData: any): Promise<void> {
    const user = this.currentUserSubject.value;
    if (user && user.uid) {
      const assessmentRef = ref(this.db, `users/${user.uid}/assessments/${Date.now()}`);
      await set(assessmentRef, { ...assessmentData, completedAt: new Date().toISOString() });
    }
  }

  async saveInterviewSession(sessionData: any): Promise<void> {
    const user = this.currentUserSubject.value;
    if (user && user.uid) {
      const interviewRef = ref(this.db, `users/${user.uid}/interviews/${Date.now()}`);
      await set(interviewRef, { ...sessionData, completedAt: new Date().toISOString() });
    }
  }

  async signUpWithEmail(email: string, password: string, name: string): Promise<boolean> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = result.user;
      
      if (user) {
        // Create user profile with provided name
        await this.createUserProfile(user, name);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Email sign-up failed:', error);
      throw error;
    }
  }

  async signInWithEmail(email: string, password: string): Promise<boolean> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      const user = result.user;
      
      if (user) {
        await this.loadOrCreateUserData(user);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Email sign-in failed:', error);
      throw error;
    }
  }

  async signInWithPhone(phoneNumber: string): Promise<any> {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          console.log('reCAPTCHA solved');
        }
      });
      
      const confirmationResult = await signInWithPhoneNumber(this.auth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (error: any) {
      console.error('Phone sign-in failed:', error);
      throw error;
    }
  }

  async verifyPhoneCode(confirmationResult: any, code: string): Promise<boolean> {
    try {
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      
      if (user) {
        await this.loadOrCreateUserData(user);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Phone verification failed:', error);
      throw error;
    }
  }

  private async createUserProfile(firebaseUser: any, displayName?: string): Promise<void> {
    const userRef = ref(this.db, `users/${firebaseUser.uid}`);
    
    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: displayName || firebaseUser.displayName || 'User',
      photoURL: firebaseUser.photoURL || null,
      phone: firebaseUser.phoneNumber || null,
      level: 1,
      xp: 0,
      streak: 0,
      totalPoints: 0,
      achievements: [],
      roadmaps: [],
      assessments: [],
      interviews: [],
      preferences: {},
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    await set(userRef, userData);
    this.currentUserSubject.next(userData);
    this.isLoggedInSubject.next(true);
  }

  private async loadOrCreateUserData(firebaseUser: any): Promise<void> {
    const userRef = ref(this.db, `users/${firebaseUser.uid}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      await this.createUserProfile(firebaseUser);
    } else {
      const userData = snapshot.val();
      await update(userRef, { lastLogin: new Date().toISOString() });
      this.currentUserSubject.next(userData);
      this.isLoggedInSubject.next(true);
    }
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }
}