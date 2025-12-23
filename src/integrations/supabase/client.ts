// Frontend-only mode: Supabase disabled
// This is a mock client that gracefully handles admin page requests
// The app functions without a backend - uses localStorage and WhatsApp instead

// Mock Supabase client for frontend-only mode
export const supabase = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          then: (callback: any) =>
            Promise.resolve(callback({ data: null, error: null })),
        }),
        then: (callback: any) =>
          Promise.resolve(callback({ data: null, error: null })),
      }),
      single: () => ({
        then: (callback: any) =>
          Promise.resolve(callback({ data: null, error: null })),
      }),
      then: (callback: any) =>
        Promise.resolve(callback({ data: null, error: null })),
    }),
    insert: () => ({
      select: () => ({
        single: () => ({
          then: (callback: any) =>
            Promise.resolve(callback({ data: null, error: null })),
        }),
        then: (callback: any) =>
          Promise.resolve(callback({ data: null, error: null })),
      }),
      then: (callback: any) =>
        Promise.resolve(callback({ data: null, error: null })),
    }),
    delete: () => ({
      eq: () => ({
        then: (callback: any) =>
          Promise.resolve(callback({ data: null, error: null })),
      }),
    }),
    update: () => ({
      eq: () => ({
        then: (callback: any) =>
          Promise.resolve(callback({ data: null, error: null })),
      }),
    }),
  }),
  auth: {
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () =>
      Promise.resolve({ data: null, error: new Error("Frontend-only mode") }),
    signUp: () =>
      Promise.resolve({ data: null, error: new Error("Frontend-only mode") }),
    updateUser: () => Promise.resolve({ data: null, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
} as any;
