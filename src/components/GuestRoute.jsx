import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const GuestRoute = ({ children }) => {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default GuestRoute
