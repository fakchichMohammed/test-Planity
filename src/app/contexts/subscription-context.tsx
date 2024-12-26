'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface SubscriptionContextType {
  isPremium: boolean
  setIsPremium: (value: boolean) => void
  maxFileSize: number
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isPremium') === 'true'
    }
    return false
  })
  
  const maxFileSize = isPremium ? 500 * 1024 * 1024 : 50 * 1024 * 1024 // 500MB for premium, 50MB for free

  const updatePremiumStatus = (status: boolean) => {
    setIsPremium(status)
    if (typeof window !== 'undefined') {
      localStorage.setItem('isPremium', status.toString())
    }
  }

  return (
    <SubscriptionContext.Provider value={{ isPremium, setIsPremium: updatePremiumStatus, maxFileSize }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

