/// <reference types="vite/client" />

declare module 'storeApp/store' {
  import { create } from 'zustand'
  import  {useUser} from '@clerk/clerk-react'

  export type User = ReturnType<typeof useUser>

  export interface Booking {
    id: string
    service: string
    date: string
    time: string
  }

  export interface AppState {
    user: User
    login: (username: string) => void
    logout: () => void
    bookings: Booking[]
    addBooking: (booking: Omit<Booking, 'id'>) => void
    removeBooking: (id: string) => void
    clearBookings: () => void
    notifications: string[]
    addNotification: (message: string) => void
    clearNotifications: () => void
  }

  export const useAppStore: ReturnType<typeof create<AppState>>
  export default useAppStore
}