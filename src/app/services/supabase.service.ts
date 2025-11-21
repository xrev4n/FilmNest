import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from './supabase.client';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  updated_at?: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  birthdate?: string | null;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private initialized = false;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      this.currentUserSubject.next(session?.user || null);
      this.initialized = true;
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            this.currentUserSubject.next(session.user);
          }
        } else {
          this.currentUserSubject.next(session?.user || null);
        }
      });
    } catch {
      this.initialized = true;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async getUserProfile(): Promise<{ data: UserProfile | null; error: any }> {
    const user = this.getCurrentUser();
    if (!user) {
      return { data: null, error: { message: 'Usuario no autenticado' } };
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    return { data, error };
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<{ data: UserProfile | null; error: any }> {
    const user = this.getCurrentUser();
    if (!user) {
      return { data: null, error: { message: 'Usuario no autenticado' } };
    }
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }
}