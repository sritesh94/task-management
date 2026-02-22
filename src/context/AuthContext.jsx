import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const user = localStorage.getItem("user")
      if (!user) return false
      const parsed = JSON.parse(user)
      return !!(parsed && parsed.isLoggedIn)
    } catch {
      return false
    }
  })

  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const user = localStorage.getItem("user")
        if (!user) {
          setIsLoggedIn(false)
          return
        }
        const parsed = JSON.parse(user)
        setIsLoggedIn(!!(parsed && parsed.isLoggedIn))
      } catch {
        setIsLoggedIn(false)
      }
    }
    window.addEventListener("storage", syncFromStorage)
    return () => window.removeEventListener("storage", syncFromStorage)
  }, [])

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify({ ...userData, isLoggedIn: true }))
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.clear()
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
