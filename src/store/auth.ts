'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile, ProfileFormData } from '@/types/database'
import { signIn as supabaseClientSignIn, signUp as supabaseClientSignUp, signOut as supabaseClientSignOut } from '@/services/supabase/client'
import supabase from '@/services/supabase/client'
import { updateProfile as supabaseUpdateProfile } from '@/services/supabase/profiles'
import { ProfileService } from '@/services/profileService'

interface AuthState {
  // data
  user: User | null
  session: Session | null
  profile: Profile | null
  // ui state
  isLoading: boolean
  error: string | null
  hydrated: boolean
  authError: string | null
  // actions
  /** Called exactly once in AuthProvider with the *server* values.  */
  setInitialAuthState: (user: User | null, session: Session | null, profile: Profile | null) => void
  /** Wipe local state + storage (used by signOut and invalid sessions). */
  clear: () => void
  /** Explicit sign-out button. */
  signOut: () => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ data: { user: User | null, session: Session | null } | null, error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ data: { user: User | null, session: Session | null } | null, error: Error | null }>
  /** Update user profile */
  updateProfile: (profileData: Partial<Profile>) => Promise<{ error: string | null }>
  /** Set error state */
  setError: (error: string | null) => void
  setAuthError: (error: string | null) => void
  fetchProfile: () => Promise<{ error: string | null }>
}

const STORAGE_KEY = 'orangecat-auth-store';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ---------------- default state ----------------
      user: null,
      session: null,
      profile: null,
      isLoading: true,     // true until we *know* something
      error: null,
      hydrated: false,
      authError: null,
      // ---------------- actions ----------------
      setInitialAuthState: (user, session, profile) => {
        // ALWAYS trust the server snapshot – even if it's null
        set({
          user,
          session,
          profile,
          isLoading: false,
          hydrated: true,
          error: null,
          authError: null,
        })
      },
      clear: () => {
        set({
          user: null,
          session: null,
          profile: null,
          isLoading: false,
          error: null,
          authError: null,
        })
        // purge persisted copy so the zombie can't rise again
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEY)
          sessionStorage.removeItem(STORAGE_KEY)
        }
      },
      fetchProfile: async () => {
        const { user, session } = get() 
        if (!user || !session) { 
          set({ profile: null, isLoading: false, error: 'User not authenticated' }) 
          return { error: 'User not authenticated' }
        }

        set({ isLoading: true, error: null }) 
        try {
          if (process.env.NODE_ENV === 'development') {
            console.log('Fetching profile for user:', user.id);
          }
          const { data: { user: freshUser }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !freshUser) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to get fresh user data:', userError);
            }
            set({ profile: null, isLoading: false, error: 'Authentication expired' }); 
            get().clear(); // Clear auth state if user is no longer valid
            return { error: 'Authentication expired' };
          }

          const { data: profileData, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', freshUser.id)
            .single()

          if (fetchError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Profile fetch error:', fetchError);
            }
            set({ profile: null, isLoading: false, error: fetchError.message });
            return { error: fetchError.message };
          }

          if (profileData) {
            set({ profile: profileData, isLoading: false, error: null });
            if (process.env.NODE_ENV === 'development') {
              console.log('Profile fetched successfully');
            }
            return { error: null };
          } else {
            set({ profile: null, isLoading: false, error: 'Profile not found' });
            return { error: 'Profile not found' };
          }
        } catch (error: any) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Profile fetch exception:', error);
          }
          set({ profile: null, isLoading: false, error: error.message || 'Failed to fetch profile' });
          return { error: error.message || 'Failed to fetch profile' };
        }
      },
      signOut: async () => {
        set({ isLoading: true, authError: null })
        try {
          get().clear()
          
          if (typeof window !== 'undefined') {
            document.cookie.split(';').forEach(cookie => {
              const trimmedCookie = cookie.trim()
              if (trimmedCookie.startsWith('sb-')) {
                const name = trimmedCookie.split('=')[0]
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
              }
            })
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')) {
                localStorage.removeItem(key)
              }
            })
            sessionStorage.removeItem(STORAGE_KEY)
          }
          
          const { error: supabaseError } = await supabaseClientSignOut(); // Use imported client signOut
          
          if (supabaseError) {
            set({ authError: supabaseError.message, isLoading: false });
            return { error: supabaseError };
          }
          set({ isLoading: false, authError: null });
          return { error: null };
        } catch (e: any) {
          const errMsg = e?.message ?? 'Unknown error during sign out';
          set({ authError: errMsg, isLoading: false });
          return { error: new Error(errMsg) };
        }
      },
      signIn: async (email, password) => {
        // Prevent multiple concurrent sign-in attempts
        const currentState = get();
        if (currentState.isLoading) {
          console.warn("Sign in already in progress, ignoring duplicate request");
          return { data: null, error: new Error("Sign in already in progress") };
        }

        set({ isLoading: true, authError: null, error: null });
        
        try {
          if (process.env.NODE_ENV === 'development') {
            console.log("Attempting sign in with:", email);
          }
          
          // Clear any existing state to prevent conflicts
          set({ 
            user: null,
            session: null,
            profile: null,
            error: null,
            authError: null,
            isLoading: true
          });
          
          const result = await supabaseClientSignIn(email, password); 
          
          if (result.error) {
            if (process.env.NODE_ENV === 'development') {
              console.error("Sign in error:", result.error.message);
            }
            set({ authError: result.error.message, isLoading: false });
            return { data: null, error: result.error };
          }

          if (result.data && result.data.user && result.data.session) {
            if (process.env.NODE_ENV === 'development') {
              console.log("Sign in successful, setting user and session");
            }
            
            // Set user and session immediately
            set({ 
              user: result.data.user, 
              session: result.data.session, 
              authError: null
            });
            
            // Fetch profile with retry logic
            let profileFetchAttempts = 0;
            const maxProfileAttempts = 3;
            
            while (profileFetchAttempts < maxProfileAttempts) {
              try {
                if (process.env.NODE_ENV === 'development') {
                  console.log(`Fetching profile after successful login (attempt ${profileFetchAttempts + 1}/${maxProfileAttempts})`);
                }
                const profileResult = await get().fetchProfile();
                
                if (profileResult.error) {
                  if (process.env.NODE_ENV === 'development') {
                    console.warn(`Profile fetch error (attempt ${profileFetchAttempts + 1}):`, profileResult.error);
                  }
                  
                  // For the last attempt, don't retry but still succeed login
                  if (profileFetchAttempts === maxProfileAttempts - 1) {
                    if (process.env.NODE_ENV === 'development') {
                      console.warn("Profile fetch failed after all attempts, but login succeeded");
                    }
                    break;
                  }
                  
                  // Wait before retry
                  await new Promise(resolve => setTimeout(resolve, 1000 * (profileFetchAttempts + 1)));
                  profileFetchAttempts++;
                  continue;
                } else {
                  if (process.env.NODE_ENV === 'development') {
                    console.log("Profile fetched successfully");
                  }
                  break;
                }
              } catch (profileError) {
                if (process.env.NODE_ENV === 'development') {
                  console.error(`Profile fetch exception (attempt ${profileFetchAttempts + 1}):`, profileError);
                }
                profileFetchAttempts++;
                
                if (profileFetchAttempts < maxProfileAttempts) {
                  await new Promise(resolve => setTimeout(resolve, 1000 * profileFetchAttempts));
                }
              }
            }
            
            set({ isLoading: false });
            
            // Login was successful regardless of profile fetch status
            return { data: result.data, error: null };
          } else {
            // Handle unexpected case where we have no error but also no user/session
            if (process.env.NODE_ENV === 'development') {
              console.error("Sign in returned no error but also missing user/session data");
            }
            const errorMessage = "Authentication succeeded but user data is missing. Please try again.";
            set({ authError: errorMessage, isLoading: false });
            return { data: null, error: new Error(errorMessage) };
          }
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.error("Sign in exception:", e);
          }
          const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during sign in. Please try again.";
          set({ 
            authError: errorMessage, 
            isLoading: false,
            user: null,
            session: null,
            profile: null
          });
          return { data: null, error: new Error(errorMessage) };
        }
      },
      signUp: async (email, password) => {
        set({ isLoading: true, authError: null });
        try {
          if (process.env.NODE_ENV === 'development') {
            console.log("Attempting sign up with:", email);
          }
          const result = await supabaseClientSignUp(email, password);
          
          if (result.error) {
            if (process.env.NODE_ENV === 'development') {
              console.error("Sign up error:", result.error.message);
            }
            set({ authError: result.error.message, isLoading: false });
            return { data: null, error: result.error };
          }

          if (result.data && result.data.user) {
            set({ 
              user: result.data.user, 
              session: result.data.session, 
              authError: null,
              isLoading: false
            });
            return { data: result.data, error: null };
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.error("Sign up succeeded but no user data returned");
            }
            set({ authError: "Registration succeeded but user data is missing", isLoading: false });
            return { data: null, error: new Error("Registration succeeded but user data is missing") };
          }
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.error("Sign up exception:", e);
          }
          set({ 
            authError: e instanceof Error ? e.message : "Unknown error during sign up", 
            isLoading: false 
          });
          return { data: null, error: e instanceof Error ? e : new Error("Unknown error during sign up") };
        }
      },
      updateProfile: async (profileData: Partial<Profile>) => {
        const { user } = get();
        if (!user) {
          console.error('AuthStore: updateProfile failed - User not found.');
          return { error: 'User not found. Please log in again.' };
        }

        set({ isLoading: true, error: null });
        console.log('AuthStore: updateProfile started', { user_id: user.id });

        try {
          if (process.env.NODE_ENV === 'development') {
            console.log('AuthStore: Starting profile update for user:', user.id);
          }
          
          // Validate required fields
          if (!profileData.username && !profileData.display_name && !profileData.bio) {
            const errorMessage = 'At least one field (username, display name, or bio) must be provided for update.';
            set({ isLoading: false, error: errorMessage });
            return { error: errorMessage };
          }

          // Prepare the update data with timestamp, ensuring proper types
          const updateData: ProfileFormData = {
            username: profileData.username || undefined,
            display_name: profileData.display_name || undefined,
            bio: profileData.bio || undefined,
            avatar_url: profileData.avatar_url || undefined,
            banner_url: profileData.banner_url || undefined,
            bitcoin_address: profileData.bitcoin_address || undefined,
          };

          if (process.env.NODE_ENV === 'development') {
            console.log('AuthStore: Updating profile with data:', updateData);
          }

          const result = await supabaseUpdateProfile(user.id, updateData);
          
          if (result.error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('AuthStore: Profile update failed:', result.error);
            }
            set({ isLoading: false, error: result.error });
            return { error: result.error };
          }

          if (result.data) {
            if (process.env.NODE_ENV === 'development') {
              console.log('AuthStore: Profile updated successfully:', result.data);
            }
            set({ profile: result.data, isLoading: false, error: null });
            return { error: null };
          } else {
            const errorMessage = 'Profile update succeeded but no data was returned.';
            if (process.env.NODE_ENV === 'development') {
              console.warn('AuthStore:', errorMessage);
            }
            set({ isLoading: false, error: errorMessage });
            return { error: errorMessage };
          }
        } catch (error: any) {
          if (process.env.NODE_ENV === 'development') {
            console.error('AuthStore: Error during profile update:', error);
          }
          const errorMessage = error.message || 'An unexpected error occurred during profile update.';
          set({ isLoading: false, error: errorMessage });
          return { error: errorMessage };
        }
      },
      setError: (error) => {
        set({ error })
      },
      setAuthError: (error) => {
        set({ authError: error })
      },
    }),
    {
      name: 'orangecat-auth-store',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') return sessionStorage;

        // Try to detect storage availability
        const testKey = 'storage-test';
        const testValue = 'test';
        
        try {
          // Try localStorage first
          localStorage.setItem(testKey, testValue);
          const value = localStorage.getItem(testKey);
          localStorage.removeItem(testKey);
          
          if (value === testValue) {
            return localStorage;
          }
        } catch (e) {
          console.warn('localStorage not available:', e);
        }
        
        try {
          // Fall back to sessionStorage
          sessionStorage.setItem(testKey, testValue);
          const value = sessionStorage.getItem(testKey);
          sessionStorage.removeItem(testKey);
          
          if (value === testValue) {
            return sessionStorage;
          }
        } catch (e) {
          console.warn('sessionStorage not available:', e);
        }
        
        // If both fail, use memory storage
        console.warn('No persistent storage available, using memory storage');
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        profile: state.profile,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
          
          // Add a safety timeout to prevent stuck loading state
          if (typeof window !== 'undefined' && state.isLoading) {
            if (process.env.NODE_ENV === 'development') {
              console.log('Auth store: Setting safety timeout for loading state');
            }
            setTimeout(() => {
              const currentState = useAuthStore.getState();
              if (currentState.isLoading) {
                if (process.env.NODE_ENV === 'development') {
                  console.warn('Auth store: Loading state stuck for 10 seconds, resetting');
                }
                useAuthStore.setState({ isLoading: false });
              }
            }, 10000);
          }
        }
      },
    }
  )
)

// ---------- live session watcher (client only) ----------
if (typeof window !== 'undefined' && supabase) {
  let isUpdating = false; // Prevent concurrent updates
  let lastUpdateTime = 0; // Throttle updates
  let authCheckCount = 0; // Count consecutive auth checks

  supabase.auth.onAuthStateChange(async (event, session) => {
    // Throttle updates - don't process more than one update every 3000ms for better performance
    const now = Date.now();
    if (now - lastUpdateTime < 3000) {
      return; // Skip processing for throttled updates
    }
    
    if (isUpdating) {
      return; // Skip processing for concurrent updates
    }

    isUpdating = true;
    lastUpdateTime = now;
    authCheckCount++;
    
    // Only log important events in development, and much less frequently
    if (process.env.NODE_ENV === 'development' && 
        (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || authCheckCount % 10 === 1)) {
      console.log(`Auth state change event ${authCheckCount}: ${event}`, { hasSession: !!session });
    }
    
    const { setInitialAuthState, clear, fetchProfile } = useAuthStore.getState();

    try {
      // Simplify logic - just use the provided session directly
      if (session) {
        // Set the session directly first to avoid UI flicker
        setInitialAuthState(session.user, session, null);
        
        // Then try to fetch profile in the background
        fetchProfile().catch(error => {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching profile on auth state change:', error);
          }
        });
      } else {
        // No session - clear the store
        if (process.env.NODE_ENV === 'development' && 
            (event === 'SIGNED_OUT' || authCheckCount % 20 === 1)) {
          console.log('No session in auth state change, clearing auth store');
        }
        
        // First clean up any leftover storage
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY)
            sessionStorage.removeItem(STORAGE_KEY)
            
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')) {
                localStorage.removeItem(key)
              }
            });
          }
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Error clearing storage during auth state sync:', e);
          }
        }
        
        // Then clear the state store
        clear();
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error in auth state change handler:', error);
      }
      clear();
    } finally {
      isUpdating = false;
    }
  });
}