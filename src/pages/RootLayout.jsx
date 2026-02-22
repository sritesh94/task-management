import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const RootLayout = () => {
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()
  const navClass = ({ isActive }) =>
    isActive
      ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pointer-events-none'
      : 'text-gray-600 hover:text-blue-600'

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="page-wrapper">
        <header className="bg-white shadow-md border-b border-slate-200">
            <nav className="container mx-auto flex gap-3 items-center justify-end p-4">
                <h1 className="mr-auto">Task Manager</h1>
                <NavLink to="/" className={navClass}>Home</NavLink>
                {!isLoggedIn && (
                  <>
                    <NavLink to="login" className={navClass}>Login</NavLink>
                    <NavLink to="register" className={navClass}>Register</NavLink>
                  </>
                )}
                {isLoggedIn && (
                  <>
                    <NavLink to="dashboard" className={navClass}>Dashboard</NavLink>
                    <button type="button" onClick={handleLogout} className="text-gray-600 hover:text-blue-600 bg-transparent border-none cursor-pointer p-0 font-inherit">Logout</button>
                  </>
                )}
            </nav>
        </header>
        <main className="container mx-auto mt-8 px-4">
            <Outlet />
        </main>
    </div>
  )
}

export default RootLayout