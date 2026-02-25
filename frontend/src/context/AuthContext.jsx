import { createContext, useContext, useState } from 'react'
import { googleLogout } from '@react-oauth/google'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (profile) => setUser(profile)

  const logout = () => {
    googleLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
