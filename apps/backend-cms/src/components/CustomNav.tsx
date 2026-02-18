'use client'

import { useAuth } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import React from 'react'

export const CustomNav: React.FC = () => {
  const router = useRouter()
  const { logOut, user } = useAuth()

  const handleLogout = async () => {
    try {
      await logOut()
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.5rem 1rem',
      }}
    >
      <span style={{ fontSize: '0.875rem', color: '#666' }}>{user.email}</span>
      <button
        type="button"
        onClick={handleLogout}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#c82333'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#dc3545'
        }}
      >
        Logout
      </button>
    </div>
  )
}
