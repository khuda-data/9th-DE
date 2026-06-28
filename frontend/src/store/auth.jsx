import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuth = create(
  persist(
    (set) => ({
      user: null,   // { login, avatar_url, name }
      login:  (user) => set({ user }),
      logout: ()     => set({ user: null }),
    }),
    { name: 'trace-auth' }
  )
)
