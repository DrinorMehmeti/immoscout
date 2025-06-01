import React, { createContext, useState, useContext, useEffect, ReactNode, FC } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';
import { useNavigate } from 'react-router-dom';

type ProfileType = Database['public']['Tables']['profiles']['Row'];

interface User extends SupabaseUser {
  profile?: ProfileType;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<{success: boolean; errorMessage?: string}>;
  register: (name: string, email: string, password: string, userType: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{success: boolean; errorMessage?: string}>;
  updatePassword: (newPassword: string) => Promise<{success: boolean; errorMessage?: string}>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();

  const fetchProfile = async (userId: string): Promise<ProfileType | null> => {
    try {
      // Direct query approach to avoid RLS recursion
      const { data, error } = await supabase.rpc('get_profile_by_id', {
        user_id: userId
      });
      
      if (error) {
        console.error('Error in RPC call:', error);
        
        // Fallback to direct query if RPC fails
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (profileError) {
          console.error('Fallback error fetching profile:', profileError);
          return null;
        }
        
        return profileData;
      }
      
      return data;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check active session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { user } = session;
        // Fetch user profile
        const profile = await fetchProfile(user.id);
          
        setAuthState({
          user: {
            ...user,
            profile: profile || undefined,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { user } = session;
          
          // Wait a short time to allow the profile to be fully committed
          // before attempting to fetch it (handles race condition)
          setTimeout(async () => {
            const profile = await fetchProfile(user.id);
              
            setAuthState({
              user: {
                ...user,
                profile: profile || undefined,
              },
              isAuthenticated: true,
              isLoading: false,
            });
          }, 500); // 500ms delay to allow database to commit
          
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{success: boolean; errorMessage?: string}> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        let errorMessage = 'Authentication failed. Please try again.';
        
        // Provide more specific error messages based on error code/message
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please verify your email address before logging in.';
        }
        
        return { success: false, errorMessage };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, errorMessage: 'An unexpected error occurred. Please try again later.' };
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    userType: string
  ): Promise<boolean> => {
    try {
      // Sign up the user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError || !user) {
        throw signUpError;
      }
      
      // Create a profile for the user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          name,
          user_type: userType,
          is_premium: false,
          is_admin: userType === 'seller' || userType === 'landlord'
        });
        
      if (profileError) {
        throw profileError;
      }
      
      // Don't try to immediately fetch the profile here
      // It will be handled by the auth state change listener
      
      return true;
    } catch (error) {
      console.error('Error registering:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Redirect handled by auth state change listener
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const resetPassword = async (email: string): Promise<{success: boolean; errorMessage?: string}> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        return { success: false, errorMessage: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, errorMessage: 'An unexpected error occurred. Please try again later.' };
    }
  };

  const updatePassword = async (newPassword: string): Promise<{success: boolean; errorMessage?: string}> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        return { success: false, errorMessage: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating password:', error);
      return { success: false, errorMessage: 'An unexpected error occurred. Please try again later.' };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      authState, 
      login, 
      register, 
      logout, 
      resetPassword,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};