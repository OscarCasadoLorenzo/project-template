'use client'

import { useAuth } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import React from 'react'

export const LogoutButton: React.FC = () => {
  const router = useRouter()
  const { logOut } = useAuth()

  const handleLogout = async () => {
    try {
      await logOut()
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="btn btn--style-secondary btn--size-small"
      style={{
        marginLeft: '1rem',
        padding: '0.5rem 1rem',
        borderRadius: '0.25rem',
        cursor: 'pointer',
      }}
    >
      Logout
    </button>
  )
}
